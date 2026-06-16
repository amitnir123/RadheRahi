import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import Booking from "../models/booking.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BOOKING_STATUS } from "../constants.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// RENTER: create razorpay order after booking accepted
const createOrder = asyncHandler(async (req, res) => {
    const { bookingId } = req.body;

    if (!bookingId) {
        throw new ApiError(400, "bookingId is required");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.renter.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to pay for this booking");
    }

    if (booking.status !== BOOKING_STATUS.ACCEPTED) {
        throw new ApiError(400, "Payment is only allowed for accepted bookings");
    }

    if (booking.payment.status === "paid") {
        throw new ApiError(400, "This booking is already paid");
    }

    const existingPayment = await Payment.findOne({ booking: bookingId });

    if (existingPayment && existingPayment.status === "paid") {
        throw new ApiError(400, "This booking is already paid");
    }

    // Razorpay amount is in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(booking.totalPrice * 100);

    const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `booking_${bookingId}`,
        notes: {
            bookingId: bookingId.toString(),
            renterId: req.user._id.toString()
        }
    });

    // Save or update payment record
    let payment;

    if (existingPayment) {
        existingPayment.razorpayOrderId = order.id;
        existingPayment.status = "pending";
        payment = await existingPayment.save();
    } else {
        payment = await Payment.create({
            booking: bookingId,
            renter: req.user._id,
            amount: booking.totalPrice,
            currency: "INR",
            razorpayOrderId: order.id
        });
    }

    return res.status(200).json(
        new ApiResponse(200, {
            orderId: order.id,
            amount: booking.totalPrice,
            amountInPaise,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID, // frontend needs this
            paymentId: payment._id,
            bookingId
        }, "Razorpay order created")
    );
});

// RENTER: verify payment after frontend pays
// Razorpay sends 3 things to frontend after payment:
// razorpay_order_id, razorpay_payment_id, razorpay_signature
// Frontend sends these to this route → backend verifies signature
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
        throw new ApiError(400, "All payment verification fields are required");
    }

    // VERIFY SIGNATURE — HMAC SHA256
    // signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment verification failed. Invalid signature");
    }

    // Signature valid — mark payment as paid
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
        throw new ApiError(404, "Payment record not found");
    }

    if (payment.status === "paid") {
        throw new ApiError(400, "Payment already verified");
    }

    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.paidAt = new Date();
    await payment.save();

    // Update booking payment status
    await Booking.findByIdAndUpdate(bookingId, {
        "payment.status": "paid",
        "payment.transactionId": razorpay_payment_id
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { payment }, "Payment verified successfully"));
});

// GET: payment status for a booking
const getPaymentStatus = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    const isRenter = booking.renter.toString() === req.user._id.toString();
    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isRenter && !isOwner && !isAdmin) {
        throw new ApiError(403, "You are not allowed to view this payment");
    }

    const payment = await Payment.findOne({ booking: bookingId })
        .populate("renter", "fullname email username");

    if (!payment) {
        throw new ApiError(404, "No payment record found for this booking");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment status fetched successfully"));
});

// RENTER: cancel booking + trigger razorpay refund
const cancelAndRefund = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.renter.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to cancel this booking");
    }

    if (![BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.PENDING].includes(booking.status)) {
        throw new ApiError(400, `Cannot cancel a ${booking.status} booking`);
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.cancellationReason = reason || "Cancelled by renter";
    await booking.save();

    const payment = await Payment.findOne({ booking: bookingId });

    // Only refund if paid
    if (payment && payment.status === "paid" && payment.razorpayPaymentId) {
        try {
            const refund = await razorpay.payments.refund(
                payment.razorpayPaymentId,
                {
                    amount: Math.round(payment.amount * 100), // full refund in paise
                    notes: {
                        reason: reason || "Cancelled by renter",
                        bookingId: bookingId.toString()
                    }
                }
            );

            payment.status = "refunded";
            payment.razorpayRefundId = refund.id;
            payment.refundAmount = refund.amount / 100;
            payment.refundedAt = new Date();
            await payment.save();

            booking.payment.status = "refunded";
            await booking.save();

            return res.status(200).json(
                new ApiResponse(200, {
                    booking,
                    refund: {
                        refundId: refund.id,
                        amount: refund.amount / 100,
                        currency: refund.currency
                    }
                }, "Booking cancelled and refund initiated successfully")
            );
        } catch (err) {
            console.error("Razorpay refund failed:", err.message);
            return res.status(200).json(
                new ApiResponse(200, { booking },
                    "Booking cancelled. Refund could not be processed automatically. Contact support")
            );
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { booking }, "Booking cancelled successfully"));
});

export {
    createOrder,
    verifyPayment,
    getPaymentStatus,
    cancelAndRefund
};