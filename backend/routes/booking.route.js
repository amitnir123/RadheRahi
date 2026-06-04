import { Router } from "express";
import {
    createBooking,
    getMyBookings,
    getOwnerBookings,
    getBookingById,
    acceptBooking,
    rejectBooking,
    cancelBooking,
    completeBooking
} from "../controllers/booking.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes need login
router.use(verifyJWT);

// RENTER
router.route("/").post(authorizeRoles("renter", "admin"), createBooking);
router.route("/my").get(authorizeRoles("renter", "admin"), getMyBookings);

// OWNER
router.route("/owner").get(authorizeRoles("owner", "admin"), getOwnerBookings);

// SHARED (renter + owner + admin see single booking)
router.route("/:bookingId").get(getBookingById);

// OWNER ACTIONS
router.route("/:bookingId/accept").patch(authorizeRoles("owner", "admin"), acceptBooking);
router.route("/:bookingId/reject").patch(authorizeRoles("owner", "admin"), rejectBooking);
router.route("/:bookingId/complete").patch(authorizeRoles("owner", "admin"), completeBooking);

// RENTER ACTIONS
router.route("/:bookingId/cancel").patch(authorizeRoles("renter", "admin"), cancelBooking);

export default router;