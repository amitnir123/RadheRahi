import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true
        },
        renter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            default: "INR",
            uppercase: true,
            trim: true
        },
        // razorpay order id — created when renter initiates payment
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        // razorpay payment id — filled after frontend payment succeeds
        razorpayPaymentId: {
            type: String,
            default: null,
            trim: true
        },
        // razorpay refund id — filled after refund
        razorpayRefundId: {
            type: String,
            default: null,
            trim: true
        },
        // razorpay signature — stored after verification
        razorpaySignature: {
            type: String,
            default: null,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "paid", "refunded", "failed"],
            default: "pending"
        },
        paidAt: {
            type: Date,
            default: null
        },
        refundedAt: {
            type: Date,
            default: null
        },
        refundAmount: {
            type: Number,
            default: null
        }
    },
    { timestamps: true }
);

paymentSchema.index({ booking: 1 });
paymentSchema.index({ renter: 1 });
paymentSchema.index({ razorpayOrderId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;