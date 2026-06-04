import { Router } from "express";
import {
    pingLocation,
    getLocationTrail,
    getLatestLocation,
    clearTrail
} from "../controllers/gps.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { verifyGpsDevice } from "../middlewares/gpsDevice.middleware.js";

const router = Router();

// GPS DEVICE sends ping — no JWT, uses device API key instead
router.route("/ping").post(verifyGpsDevice, pingLocation);

// HUMAN USERS — need JWT
router.route("/:bookingId").get(verifyJWT, getLocationTrail);
router.route("/:bookingId/latest").get(verifyJWT, getLatestLocation);
router.route("/:bookingId").delete(verifyJWT, authorizeRoles("admin"), clearTrail);

export default router;