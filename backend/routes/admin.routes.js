import { Router } from "express";
import {
    getStats,
    getAllUsers,
    toggleUserStatus,
    getAllVehicles,
    getAllBookings,
    getAllPayments,
    migrateLegacyUsers,
    monitorStream,
    getMonitorSnapshot
} from "../controllers/admin.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// All admin routes need JWT + admin role
router.use(verifyJWT);
router.use(authorizeRoles("admin"));

router.route("/stats").get(getStats);
router.route("/monitor").get(getMonitorSnapshot);
router.route("/monitor/stream").get(monitorStream);
router.route("/users/migrate-legacy").post(migrateLegacyUsers);
router.route("/users").get(getAllUsers);
router.route("/users/:userId/toggle").patch(toggleUserStatus);
router.route("/vehicles").get(getAllVehicles);
router.route("/bookings").get(getAllBookings);
router.route("/payments").get(getAllPayments);

export default router;