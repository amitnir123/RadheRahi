import Stripe from "stripe";
import Payment from "../models/payment.model.js";
import Booking from "../models/booking.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BOOKING_STATUS } from "../constants.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// RENTER: create stripe payment intent after booking is accepted
const createPaymentIntent = asyncHandler(async (req, res) => {
    const { bookingId } = req.body;

    if (!bookingId) {
        throw new ApiError(400, "bookingId is required");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // Only renter of this booking can pay
    if (booking.renter.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to pay for this booking");
    }

    // Must be accepted first
    if (booking.status !== BOOKING_STATUS.ACCEPTED) {
        throw new ApiError(400, "Payment is only allowed for accepted bookings");
    }

    // Block if already paid
    if (booking.payment.status === "paid") {
        throw new ApiError(400, "This booking is already paid");
    }

    // Check if payment intent already exists (prevent duplicate)
    const existingPayment = await Payment.findOne({ booking: bookingId });

    if (existingPayment && existingPayment.status === "paid") {
        throw new ApiError(400, "This booking is already paid");
    }

    // Stripe amount is in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(booking.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: "inr",
        metadata: {
            bookingId: bookingId.toString(),
            renterId: req.user._id.toString()
        }
    });

    // Save or update payment record
    let payment;

    if (existingPayment) {
        existingPayment.stripePaymentIntentId = paymentIntent.id;
        existingPayment.status = "pending";
        payment = await existingPayment.save();
    } else {
        payment = await Payment.create({
            booking: bookingId,
            renter: req.user._id,
            amount: booking.totalPrice,
            currency: "inr",
            stripePaymentIntentId: paymentIntent.id
        });
    }

    return res.status(200).json(
        new ApiResponse(200, {
            clientSecret: paymentIntent.client_secret,
            paymentId: payment._id,
            amount: booking.totalPrice,
            currency: "inr"
        }, "Payment intent created. Use clientSecret on frontend to complete payment")
    );
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

// STRIPE WEBHOOK: raw body needed — registered before express.json() in app.js
const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }

    try {
        switch (event.type) {

            // Payment succeeded
            case "payment_intent.succeeded": {
                const intent = event.data.object;
                const bookingId = intent.metadata?.bookingId;
                if (!bookingId) break;

                const payment = await Payment.findOne({
                    stripePaymentIntentId: intent.id
                });
                if (!payment) break;

                payment.status = "paid";
                payment.stripeChargeId = intent.latest_charge || null;
                payment.paidAt = new Date();
                await payment.save();

                await Booking.findByIdAndUpdate(bookingId, {
                    "payment.status": "paid",
                    "payment.transactionId": intent.id
                });

                console.log(`Payment succeeded for booking: ${bookingId}`);
                break;
            }

            // Payment failed
            case "payment_intent.payment_failed": {
                const intent = event.data.object;
                const bookingId = intent.metadata?.bookingId;
                if (!bookingId) break;

                const payment = await Payment.findOne({
                    stripePaymentIntentId: intent.id
                });
                if (!payment) break;

                payment.status = "failed";
                await payment.save();

                console.log(`Payment failed for booking: ${bookingId}`);
                break;
            }

            // Refund succeeded
            case "charge.refunded": {
                const charge = event.data.object;

                const payment = await Payment.findOne({
                    stripeChargeId: charge.id
                });
                if (!payment) break;

                const refund = charge.refunds?.data?.[0];

                payment.status = "refunded";
                payment.stripeRefundId = refund?.id || null;
                payment.refundAmount = refund ? refund.amount / 100 : payment.amount;
                payment.refundedAt = new Date();
                await payment.save();

                await Booking.findByIdAndUpdate(payment.booking, {
                    "payment.status": "refunded"
                });

                console.log(`Refund processed for payment: ${payment._id}`);
                break;
            }

            default:
                break;
        }
    } catch (err) {
        console.error("Webhook handler error:", err.message);
        return res.status(500).json({ message: "Webhook handler failed" });
    }

    res.status(200).json({ received: true });
};

// RENTER: cancel booking + trigger stripe auto refund
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

    // Try refund if already paid
    const payment = await Payment.findOne({ booking: bookingId });

    if (payment && payment.status === "paid" && payment.stripeChargeId) {
        try {
            const refund = await stripe.refunds.create({
                charge: payment.stripeChargeId
            });

            payment.status = "refunded";
            payment.stripeRefundId = refund.id;
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
            // Stripe failed — booking still cancelled, flag for manual review
            console.error("Stripe refund failed:", err.message);
            return res.status(200).json(
                new ApiResponse(200, { booking },
                    "Booking cancelled. Refund could not be processed automatically. Please contact support")
            );
        }
    }

    // Not paid yet — just cancel
    return res
        .status(200)
        .json(new ApiResponse(200, { booking }, "Booking cancelled successfully"));
});

export {
    createPaymentIntent,
    getPaymentStatus,
    stripeWebhook,
    cancelAndRefund
};