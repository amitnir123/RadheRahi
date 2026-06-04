import GPS from "../models/gps.model.js";
import Booking from "../models/booking.model.js";
import Vehicle from "../models/vehicle.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BOOKING_STATUS } from "../constants.js";

// GPS DEVICE: ping current location
// device sends: deviceId, lat, lng, bookingId, speed?, batteryLevel?, recordedAt?
const pingLocation = asyncHandler(async (req, res) => {
    const { deviceId, bookingId, lat, lng, speed, batteryLevel, recordedAt } = req.body;

    if (!deviceId || !bookingId || lat === undefined || lng === undefined) {
        throw new ApiError(400, "deviceId, bookingId, lat and lng are required");
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new ApiError(400, "Invalid coordinates");
    }

    // Only allow pings on active (accepted) bookings
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.status !== BOOKING_STATUS.ACCEPTED) {
        throw new ApiError(400, "GPS tracking is only active for accepted bookings");
    }

    // Verify device belongs to the booked vehicle
    const vehicle = await Vehicle.findById(booking.vehicle);

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    const ping = await GPS.create({
        booking: bookingId,
        vehicle: booking.vehicle,
        deviceId,
        coordinates: { lat: Number(lat), lng: Number(lng) },
        speed: speed !== undefined ? Number(speed) : null,
        batteryLevel: batteryLevel !== undefined ? Number(batteryLevel) : null,
        recordedAt: recordedAt ? new Date(recordedAt) : new Date()
    });

    return res
        .status(201)
        .json(new ApiResponse(201, ping, "Location recorded"));
});

// OWNER/ADMIN: get full location trail for a booking
const getLocationTrail = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { page = 1, limit = 100 } = req.query;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Only the vehicle owner or admin can view full trail");
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [trail, total] = await Promise.all([
        GPS.find({ booking: bookingId })
            .sort({ recordedAt: 1 })
            .skip(skip)
            .limit(Number(limit))
            .select("coordinates speed batteryLevel recordedAt deviceId"),
        GPS.countDocuments({ booking: bookingId })
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            bookingId,
            trail,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        }, "Location trail fetched successfully")
    );
});

// OWNER/RENTER/ADMIN: get latest known location for a booking
const getLatestLocation = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    const isRenter = booking.renter.toString() === req.user._id.toString();
    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isRenter && !isOwner && !isAdmin) {
        throw new ApiError(403, "You are not allowed to view this location");
    }

    // Only show live location for active booking
    if (booking.status !== BOOKING_STATUS.ACCEPTED) {
        throw new ApiError(400, "Live tracking is only available for active bookings");
    }

    const latest = await GPS.findOne({ booking: bookingId })
        .sort({ recordedAt: -1 })
        .select("coordinates speed batteryLevel recordedAt deviceId");

    if (!latest) {
        throw new ApiError(404, "No location data found for this booking");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, latest, "Latest location fetched successfully"));
});

// ADMIN: clear GPS trail after booking completed (cleanup)
const clearTrail = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // Only allow clearing after booking is done
    if (booking.status === BOOKING_STATUS.ACCEPTED) {
        throw new ApiError(400, "Cannot clear trail of an active booking");
    }

    const result = await GPS.deleteMany({ booking: bookingId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { deletedCount: result.deletedCount },
                "GPS trail cleared successfully"
            )
        );
});

export { pingLocation, getLocationTrail, getLatestLocation, clearTrail };