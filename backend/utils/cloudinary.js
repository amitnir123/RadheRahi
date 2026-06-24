import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// NO config() call here at module level

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Configure at call time — env vars are loaded by now
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
            folder: "rentride/vehicles",
        });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Upload failed:", error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteFromCloudinary = async (public_id) => {
    try {
        if (!public_id) return null;
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        return await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };