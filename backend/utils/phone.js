/** Normalize phone to digits only for comparison/storage */
export const normalizePhone = (phone) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 ? digits : null;
};
