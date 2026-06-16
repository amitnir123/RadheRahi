import mongoose, { Schema } from "mongoose";
import { VEHICLE_STATUS } from "../constants.js";

const vehicleSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        type: {
            type: String,
            enum: ["car", "bike", "scooter"],
            required: true
        },
        brand: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        model: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        year: {
            type: Number,
            required: true,
            min: 1990,
            max: new Date().getFullYear() + 1
        },
        pricePerDay: {
            type: Number,
            required: true,
            min: 0
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: null
        },
        images: [
            {
                url: {
                    type: String,
                    required: true
                },
                public_id: {
                    type: String,
                    required: true
                }
            }
        ],
        location: {
            city: {
                type: String,
                trim: true,
                required: true
            },
            state: {
                type: String,
                trim: true,
                required: true
            }
        },
        status: {
            type: String,
            enum: Object.values(VEHICLE_STATUS),
            default: VEHICLE_STATUS.PENDING
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        rejectionReason: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

vehicleSchema.index({ status: 1, isAvailable: 1 });
vehicleSchema.index({ owner: 1 });
vehicleSchema.index({ type: 1 });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;