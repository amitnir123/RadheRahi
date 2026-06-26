import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { COOKIE_OPTIONS, LEGACY_ROLES, MIN_PASSWORD_LENGTH } from "../constants.js";
import { normalizePhone } from "../utils/phone.js";
import { logActivity } from "../utils/activityLog.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

const rejectLegacyRole = (role) => {
    if (LEGACY_ROLES.includes(role)) {
        throw new ApiError(
            403,
            "This account type is no longer supported. Please contact support or register a new account."
        );
    }
};

const register = asyncHandler(async (req, res) => {
    const { fullname, email, username, password, phone, confirmPassword } = req.body;

    if ([fullname, email, username, password, phone].some((f) => !f?.toString().trim())) {
        throw new ApiError(400, "Full name, email, username, phone and password are required");
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new ApiError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    if (confirmPassword && password !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
        throw new ApiError(400, "Enter a valid 10-digit phone number");
    }

    const emailLower = email.toLowerCase().trim();
    const usernameLower = username.toLowerCase().trim();

    const existingByEmail = await User.findOne({ email: emailLower });
    if (existingByEmail) {
        throw new ApiError(409, "An account with this email already exists");
    }

    const existingByUsername = await User.findOne({ username: usernameLower });
    if (existingByUsername) {
        throw new ApiError(409, "This username is already taken");
    }

    const existingByPhone = await User.findOne({ phone: normalizedPhone });
    if (existingByPhone) {
        throw new ApiError(409, "An account with this phone number already exists");
    }

    const user = await User.create({
        fullname: fullname.trim(),
        email: emailLower,
        username: usernameLower,
        password,
        role: "renter",
        phone: normalizedPhone
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    logActivity("register", `New user registered: ${createdUser.fullname}`, {
        userId: createdUser._id,
        email: createdUser.email
    });

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { email, username, phone, password } = req.body;

    if (!email && !username && !phone) {
        throw new ApiError(400, "Email, username or phone is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const orConditions = [];
    if (email) orConditions.push({ email: email.toLowerCase().trim() });
    if (username) orConditions.push({ username: username.toLowerCase().trim() });
    if (phone) {
        const normalizedPhone = normalizePhone(phone);
        if (normalizedPhone) orConditions.push({ phone: normalizedPhone });
    }

    const user = await User.findOne({ $or: orConditions });

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    rejectLegacyRole(user.role);

    if (!user.isActive) {
        throw new ApiError(403, "Your account has been deactivated");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    logActivity("login", `User logged in: ${loggedInUser.fullname}`, {
        userId: loggedInUser._id,
        role: loggedInUser.role
    });

    return res
        .status(200)
        .cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: null } },
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", COOKIE_OPTIONS)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    rejectLegacyRole(user.role);

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, COOKIE_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed"
            )
        );
});

export { register, login, logout, refreshAccessToken };
