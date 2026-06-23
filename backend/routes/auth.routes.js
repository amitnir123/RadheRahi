import { Router } from "express";
import {
    register,
    login,
    logout,
    refreshAccessToken
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
// user.routes.js
router.route("/me").get(verifyJWT, asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched"));
}));

export default router;