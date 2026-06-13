import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-gps-api-key"]
}));

// STRIPE WEBHOOK — must receive raw body, registered BEFORE express.json()
// Stripe needs raw Buffer to verify signature
import paymentRouter from "./routes/payment.route.js";
app.use(
    "/api/v1/payments/webhook",
    express.raw({ type: "application/json" }),
    paymentRouter
);

// Body parsers for all other routes
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes Import
import authRouter from "./routes/auth.route.js";
import vehicleRouter from "./routes/vehicle.route.js";
import bookingRouter from "./routes/booking.route.js";
import gpsRouter from "./routes/gps.route.js";

// API v1 Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/gps", gpsRouter);
app.use("/api/v1/payments", paymentRouter);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const message =
            err.code === "LIMIT_FILE_SIZE"
                ? "Image size must be less than or equal to 5MB"
                : err.message;
        return res.status(400).json({ success: false, statusCode: 400, message });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

export default app;