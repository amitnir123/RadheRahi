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
            default: "inr",
            lowercase: true,
            trim: true
        },
        // stripe payment intent id — created when renter initiates payment
        stripePaymentIntentId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        // stripe charge id — filled after payment succeeds via webhook
        stripeChargeId: {
            type: String,
            default: null,
            trim: true
        },
        // stripe refund id — filled after refund via webhook or cancelAndRefund
        stripeRefundId: {
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
        // refund amount — full for now, partial possible in future
        refundAmount: {
            type: Number,
            default: null
        }
    },
    { timestamps: true }
);

paymentSchema.index({ booking: 1 });
paymentSchema.index({ renter: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;