import { Router } from "express";
import {
    createVehicle,
    getAllVehicles,
    getMyVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    approveVehicle,
    rejectVehicle
} from "../controllers/vehicle.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// STATIC ROUTES FIRST — before any /:param routes
router.route("/my").get(verifyJWT, authorizeRoles("admin"), getMyVehicles);

// PUBLIC
router.route("/").get(verifyJWT, getAllVehicles);
router.route("/").post(
    verifyJWT,
    authorizeRoles("admin"),
    upload.array("images", 5),
    createVehicle
);

// ADMIN — also static-ish, register before /:vehicleId
// (these are fine because /approve and /reject have extra segment)

// PARAM ROUTES LAST
router.route("/:vehicleId").get(verifyJWT, getVehicleById);
router.route("/:vehicleId").patch(verifyJWT, authorizeRoles("admin"), updateVehicle);
router.route("/:vehicleId").delete(verifyJWT, authorizeRoles("admin"), deleteVehicle);
router.route("/:vehicleId/approve").patch(verifyJWT, authorizeRoles("admin"), approveVehicle);
router.route("/:vehicleId/reject").patch(verifyJWT, authorizeRoles("admin"), rejectVehicle);

export default router;