import { Router } from "express";
import {
    createOrder,
    verifyPayment,
    getPaymentStatus,
    cancelAndRefund
} from "../controllers/payment.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes need login
router.use(verifyJWT);

// RENTER: create razorpay order
router.route("/create-order").post(authorizeRoles("renter", "admin"), createOrder);

// RENTER: verify payment after frontend pays
router.route("/verify").post(authorizeRoles("renter", "admin"), verifyPayment);

// RENTER: cancel + auto refund
router.route("/cancel/:bookingId").patch(authorizeRoles("renter", "admin"), cancelAndRefund);

// ALL PARTIES: payment status
router.route("/:bookingId").get(getPaymentStatus);

export default router;