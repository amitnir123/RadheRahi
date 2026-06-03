export const DB_NAME = "rentride";

export const USER_ROLES = {
    RENTER: "renter",
    OWNER: "owner",
    ADMIN: "admin"
};

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

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
};