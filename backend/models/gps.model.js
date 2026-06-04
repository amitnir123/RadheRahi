import mongoose, { Schema } from "mongoose";

const gpsSchema = new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },
        vehicle: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true
        },
        // GPS device identifier - device sends this with every ping
        deviceId: {
            type: String,
            required: true,
            trim: true
        },
        coordinates: {
            lat: {
                type: Number,
                required: true,
                min: -90,
                max: 90
            },
            lng: {
                type: Number,
                required: true,
                min: -180,
                max: 180
            }
        },
        // speed in km/h — GPS device can send this
        speed: {
            type: Number,
            default: null,
            min: 0
        },
        // battery level of GPS device in %
        batteryLevel: {
            type: Number,
            default: null,
            min: 0,
            max: 100
        },
        // timestamp device sends — different from createdAt
        // allows out-of-order pings to be stored correctly
        recordedAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Query trail by booking fast
gpsSchema.index({ booking: 1, recordedAt: 1 });
// Query latest ping by vehicle fast
gpsSchema.index({ vehicle: 1, recordedAt: -1 });
// Device id lookups
gpsSchema.index({ deviceId: 1 });

const GPS = mongoose.model("GPS", gpsSchema);
export default GPS;