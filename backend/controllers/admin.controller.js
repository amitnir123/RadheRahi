import User from "../models/user.model.js";
import Vehicle from "../models/vehicle.model.js";
import Booking from "../models/booking.model.js";
import Payment from "../models/payment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ADMIN: platform overview stats
const getStats = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalOwners,
        totalRenters,
        totalVehicles,
        pendingVehicles,
        approvedVehicles,
        totalBookings,
        activeBookings,
        completedBookings,
        totalPayments,
        paidPayments
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "owner" }),
        User.countDocuments({ role: "renter" }),
        Vehicle.countDocuments(),
        Vehicle.countDocuments({ status: "pending" }),
        Vehicle.countDocuments({ status: "approved" }),
        Booking.countDocuments(),
        Booking.countDocuments({ status: "accepted" }),
        Booking.countDocuments({ status: "completed" }),
        Payment.countDocuments(),
        Payment.countDocuments({ status: "paid" })
    ]);

    // Total revenue from paid payments
    const revenueResult = await Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json(
        new ApiResponse(200, {
            users: { total: totalUsers, owners: totalOwners, renters: totalRenters },
            vehicles: { total: totalVehicles, pending: pendingVehicles, approved: approvedVehicles },
            bookings: { total: totalBookings, active: activeBookings, completed: completedBookings },
            payments: { total: totalPayments, paid: paidPayments, totalRevenue }
        }, "Platform stats fetched successfully")
    );
});

// ADMIN: get all users with filter + pagination
const getAllUsers = asyncHandler(async (req, res) => {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
        filter.$or = [
            { fullname: new RegExp(search, "i") },
            { email: new RegExp(search, "i") },
            { username: new RegExp(search, "i") }
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
        User.find(filter)
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        User.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        }, "Users fetched successfully")
    );
});

// ADMIN: activate or deactivate a user
const toggleUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot deactivate your own account");
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            `User ${user.isActive ? "activated" : "deactivated"} successfully`
        )
    );
});

// ADMIN: get all vehicles with filter
const getAllVehicles = asyncHandler(async (req, res) => {
    const { status, type, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (Number(page) - 1) * Number(limit);

    const [vehicles, total] = await Promise.all([
        Vehicle.find(filter)
            .populate("owner", "fullname email username phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Vehicle.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            vehicles,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        }, "Vehicles fetched successfully")
    );
});

// ADMIN: get all bookings with filter
const getAllBookings = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate("renter", "fullname email username")
            .populate("owner", "fullname email username")
            .populate("vehicle", "name type brand model")
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

// ADMIN: get all payments + revenue breakdown
const getAllPayments = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total, revenueBreakdown] = await Promise.all([
        Payment.find(filter)
            .populate("renter", "fullname email username")
            .populate("booking", "totalDays totalPrice startDate endDate")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Payment.countDocuments(filter),
        Payment.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    total: { $sum: "$amount" }
                }
            }
        ])
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            payments,
            revenueBreakdown,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        }, "Payments fetched successfully")
    );
});

export {
    getStats,
    getAllUsers,
    toggleUserStatus,
    getAllVehicles,
    getAllBookings,
    getAllPayments
};