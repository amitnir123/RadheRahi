import mongoose, { Schema } from "mongoose";
import { BOOKING_STATUS } from "../constants.js";

const bookingSchema = new Schema(
    {
        renter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        vehicle: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        totalDays: {
            type: Number,
            required: true,
            min: 1
        },
        pricePerDay: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(BOOKING_STATUS),
            default: BOOKING_STATUS.PENDING
        },
        // reason when owner rejects
        rejectionReason: {
            type: String,
            default: null
        },
        // reason when renter cancels
        cancellationReason: {
            type: String,
            default: null
        },
        // payment hook (step 5 will fill this)
        payment: {
            status: {
                type: String,
                enum: ["unpaid", "paid", "refunded"],
                default: "unpaid"
            },
            transactionId: {
                type: String,
                default: null
            }
        }
    },
    { timestamps: true }
);

bookingSchema.index({ renter: 1 });
bookingSchema.index({ owner: 1 });
bookingSchema.index({ vehicle: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;