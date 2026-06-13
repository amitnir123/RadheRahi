import { Router } from "express";
import {
    createPaymentIntent,
    getPaymentStatus,
    stripeWebhook,
    cancelAndRefund
} from "../controllers/payment.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// STRIPE WEBHOOK — no JWT, no json parser (raw body needed)
// IMPORTANT: this route is mounted in app.js BEFORE express.json()
router.route("/webhook").post(stripeWebhook);

// ALL BELOW NEED LOGIN
router.use(verifyJWT);

// RENTER: initiate payment after booking accepted
router.route("/create-intent").post(authorizeRoles("renter", "admin"), createPaymentIntent);

// RENTER: cancel booking + auto refund
router.route("/cancel/:bookingId").patch(authorizeRoles("renter", "admin"), cancelAndRefund);

// RENTER/OWNER/ADMIN: check payment status
router.route("/:bookingId").get(getPaymentStatus);

export default router;