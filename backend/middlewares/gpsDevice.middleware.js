import ApiError from "../utils/ApiError.js";

// GPS devices authenticate using a shared API key
// Device must send header: x-gps-api-key: <GPS_DEVICE_API_KEY>
// This key is set in .env and shared with all GPS hardware devices

export const verifyGpsDevice = (req, res, next) => {
    const apiKey = req.header("x-gps-api-key");

    if (!apiKey) {
        throw new ApiError(401, "GPS device API key missing");
    }

    if (apiKey !== process.env.GPS_DEVICE_API_KEY) {
        throw new ApiError(401, "Invalid GPS device API key");
    }

    next();
};