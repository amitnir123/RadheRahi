export const DB_NAME = "rentride";

export const USER_ROLES = {
    RENTER: "renter",
    ADMIN: "admin"
};

export const DEFAULT_CITY = "Mathura";
export const DEFAULT_STATE = "UP";

export const PICKUP_PLACES = [
    "Chhatikara",
    "Omax Apartment",
    "Train Station",
    "Govardhan Chauraha"
];

export const MIN_PASSWORD_LENGTH = 8;

export const VEHICLE_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    UNAVAILABLE: "unavailable"
};

export const BOOKING_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
    COMPLETED: "completed"
};

export const MAX_VEHICLE_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: SEVEN_DAYS_MS
};

export const PLATFORM_CONTACT = {
    phone: process.env.PLATFORM_PHONE || "7007722955",
    email: process.env.PLATFORM_EMAIL || "admin@rentride.com"
};

export const LEGACY_ROLES = ["owner"];