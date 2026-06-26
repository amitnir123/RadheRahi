import Booking from "../models/booking.model.js";
import Vehicle from "../models/vehicle.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BOOKING_STATUS, VEHICLE_STATUS, PICKUP_PLACES } from "../constants.js";

const calcDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

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
    const { vehicleId, startDate, endDate, pickupPlace } = req.body;

    if (!vehicleId || !startDate || !endDate || !pickupPlace) {
        throw new ApiError(400, "vehicleId, startDate, endDate and pickupPlace are required");
    }

    if (!PICKUP_PLACES.includes(pickupPlace)) {
        throw new ApiError(400, "Invalid pickup place");
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

    const conflict = await hasDateConflict(vehicleId, start, end);
    if (conflict) {
        throw new ApiError(409, "Vehicle is already booked for these dates");
    }

    const totalPrice = vehicle.pricePerDay * totalDays;

    const booking = await Booking.create({
        renter: req.user._id,
        vehicle: vehicleId,
        pickupPlace,
        startDate: start,
        endDate: end,
        totalDays,
        pricePerDay: vehicle.pricePerDay,
        totalPrice
    });

    const populatedBooking = await Booking.findById(booking._id)
        .populate("vehicle", "name type brand model images location vehicleNo ownerName");

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
            .populate("vehicle", "name type brand model images location pricePerDay ownerName vehicleNo")
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

// ADMIN: get all bookings
const getAdminBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate("vehicle", "name type brand model images vehicleNo ownerName")
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

// ANY PARTY: get single booking
const getBookingById = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
        .populate({
            path: "vehicle",
            select: "name type brand model images location pricePerDay vehicleNo ownerName",
            populate: { path: "listedBy", select: "fullname username phone avatar" }
        })
        .populate("renter", "fullname username phone avatar");

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    const isRenter = booking.renter._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isRenter && !isAdmin) {
        throw new ApiError(403, "You are not allowed to view this booking");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

// ADMIN: accept booking
const acceptBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
        throw new ApiError(400, `Booking is already ${booking.status}`);
    }

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

// ADMIN: reject booking
const rejectBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
        throw new ApiError(400, `Booking is already ${booking.status}`);
    }

    booking.status = BOOKING_STATUS.REJECTED;
    booking.rejectionReason = reason || "Booking declined";
    await booking.save();

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking rejected"));
});

// RENTER: cancel booking
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

// ADMIN: mark booking as completed
const completeBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.status !== BOOKING_STATUS.ACCEPTED) {
        throw new ApiError(400, "Only accepted bookings can be marked as completed");
    }

    if (booking.payment.status !== "paid") {
        throw new ApiError(400, "Cannot complete booking before payment is made");
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
    getAdminBookings,
    getBookingById,
    acceptBooking,
    rejectBooking,
    cancelBooking,
    completeBooking
};
