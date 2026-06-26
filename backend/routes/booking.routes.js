import { Router } from "express";
import {
    createBooking,
    getMyBookings,
    getAdminBookings,
    getBookingById,
    acceptBooking,
    rejectBooking,
    cancelBooking,
    completeBooking
} from "../controllers/booking.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(authorizeRoles("renter"), createBooking);
router.route("/my").get(authorizeRoles("renter"), getMyBookings);

router.route("/admin").get(authorizeRoles("admin"), getAdminBookings);

router.route("/:bookingId").get(getBookingById);

router.route("/:bookingId/accept").patch(authorizeRoles("admin"), acceptBooking);
router.route("/:bookingId/reject").patch(authorizeRoles("admin"), rejectBooking);
router.route("/:bookingId/complete").patch(authorizeRoles("admin"), completeBooking);

router.route("/:bookingId/cancel").patch(authorizeRoles("renter"), cancelBooking);

export default router;
