import Booking from "../models/booking.model.js";
import Vehicle from "../models/vehicle.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BOOKING_STATUS, VEHICLE_STATUS } from "../constants.js";

// helper: get number of days between two dates (inclusive)
const calcDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// helper: check if vehicle already has an overlapping ACCEPTED booking
const hasDateConflict = async (vehicleId, startDate, endDate, excludeBookingId = null) => {
    const query = {
        vehicle: vehicleId,
        status: BOOKING_STATUS.ACCEPTED,
        $or: [
            { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
        ]
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const conflict = await Booking.findOne(query);
    return !!conflict;
};

// RENTER: create booking request
const createBooking = asyncHandler(async (req, res) => {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
        throw new ApiError(400, "vehicleId, startDate and endDate are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start) || isNaN(end)) {
        throw new ApiError(400, "Invalid date format");
    }

    if (start < today) {
        throw new ApiError(400, "Start date cannot be in the past");
    }

    if (end <= start) {
        throw new ApiError(400, "End date must be after start date");
    }

    const totalDays = calcDays(start, end);

    if (totalDays < 1) {
        throw new ApiError(400, "Minimum booking is 1 day");
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    if (vehicle.status !== VEHICLE_STATUS.APPROVED) {
        throw new ApiError(400, "This vehicle is not available for booking");
    }

    if (!vehicle.isAvailable) {
        throw new ApiError(400, "This vehicle is currently unavailable");
    }

    // Owner cannot book own vehicle
    if (vehicle.owner.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot book your own vehicle");
    }

    // Check for date conflicts with existing accepted bookings
    const conflict = await hasDateConflict(vehicleId, start, end);
    if (conflict) {
        throw new ApiError(409, "Vehicle is already booked for these dates");
    }

    const totalPrice = vehicle.pricePerDay * totalDays;

    const booking = await Booking.create({
        renter: req.user._id,
        vehicle: vehicleId,
        owner: vehicle.owner,
        startDate: start,
        endDate: end,
        totalDays,
        pricePerDay: vehicle.pricePerDay,
        totalPrice
    });

    const populatedBooking = await Booking.findById(booking._id)
        .populate("vehicle", "name type brand model images location")
        .populate("owner", "fullname username phone");

    return res
        .status(201)
        .json(new ApiResponse(201, populatedBooking, "Booking request sent successfully"));
});

// RENTER: get my bookings
const getMyBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { renter: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate("vehicle", "name type brand model images location pricePerDay")
            .populate("owner", "fullname username phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Booking.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            bookings,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        }, "Bookings fetched successfully")
    );
});

// OWNER: get bookings on my vehicles
const getOwnerBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate("vehicle", "name type brand model images")
            .populate("renter", "fullname username phone avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Booking.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            bookings,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        }, "Bookings fetched successfully")
    );
});

// ANY PARTY: get single booking (only renter, owner, or admin can see)
const getBookingById = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
        .populate("vehicle", "name type brand model images location pricePerDay")
        .populate("renter", "fullname username phone avatar")
        .populate("owner", "fullname username phone avatar");

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    const isRenter = booking.renter._id.toString() === req.user._id.toString();
    const isOwner = booking.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isRenter && !isOwner && !isAdmin) {
        throw new ApiError(403, "You are not allowed to view this booking");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

// OWNER: accept booking
const acceptBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to accept this booking");
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
        throw new ApiError(400, `Booking is already ${booking.status}`);
    }

    // Re-check date conflict before accepting
    const conflict = await hasDateConflict(
        booking.vehicle,
        booking.startDate,
        booking.endDate,
        booking._id
    );

    if (conflict) {
        throw new ApiError(409, "Vehicle is already booked for these dates");
    }

    booking.status = BOOKING_STATUS.ACCEPTED;
    await booking.save();

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking accepted successfully"));
});

// OWNER: reject booking
const rejectBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to reject this booking");
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
        throw new ApiError(400, `Booking is already ${booking.status}`);
    }

    booking.status = BOOKING_STATUS.REJECTED;
    booking.rejectionReason = reason || "Owner declined your request";
    await booking.save();

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking rejected"));
});

// RENTER: cancel booking (anytime)
const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.renter.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to cancel this booking");
    }

    if ([BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED].includes(booking.status)) {
        throw new ApiError(400, `Booking is already ${booking.status}`);
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.cancellationReason = reason || "Cancelled by renter";
    await booking.save();

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

// OWNER/ADMIN: mark booking as completed
const completeBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "You are not allowed to complete this booking");
    }

    if (booking.status !== BOOKING_STATUS.ACCEPTED) {
        throw new ApiError(400, "Only accepted bookings can be marked as completed");
    }

    booking.status = BOOKING_STATUS.COMPLETED;
    await booking.save();

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking marked as completed"));
});

export {
    createBooking,
    getMyBookings,
    getOwnerBookings,
    getBookingById,
    acceptBooking,
    rejectBooking,
    cancelBooking,
    completeBooking
};