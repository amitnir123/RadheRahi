import Vehicle from "../models/vehicle.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { VEHICLE_STATUS, DEFAULT_CITY, DEFAULT_STATE } from "../constants.js";

// ADMIN: create new vehicle listing
const createVehicle = asyncHandler(async (req, res) => {
    const {
        name, type, brand, model, year, pricePerDay, description,
        city, state, vehicleNo, ownerName
    } = req.body;

    if ([name, type, brand, model, year, pricePerDay, vehicleNo, ownerName].some((f) => !f?.toString().trim())) {
        throw new ApiError(400, "All required fields must be filled");
    }

    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one vehicle image is required");
    }

    const imageUploadPromises = req.files.map((file) =>
        uploadOnCloudinary(file.path)
    );
    const uploadedImages = await Promise.all(imageUploadPromises);

    const failedUploads = uploadedImages.some((img) => !img);
    if (failedUploads) {
        throw new ApiError(500, "Image upload failed. Please try again");
    }

    const images = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id
    }));

    const vehicle = await Vehicle.create({
        listedBy: req.user._id,
        vehicleNo: vehicleNo.trim(),
        ownerName: ownerName.trim(),
        name,
        type,
        brand,
        model,
        year: Number(year),
        pricePerDay: Number(pricePerDay),
        description: description || null,
        images,
        location: {
            city: city?.trim() || DEFAULT_CITY,
            state: state?.trim() || DEFAULT_STATE
        },
        status: VEHICLE_STATUS.PENDING
    });

    return res
        .status(201)
        .json(new ApiResponse(201, vehicle, "Vehicle listed successfully. Waiting for approval"));
});

// RENTER: get all approved + available vehicles
const getAllVehicles = asyncHandler(async (req, res) => {
    const { type, city, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const filter = {
        status: VEHICLE_STATUS.APPROVED,
        isAvailable: true
    };

    if (type) filter.type = type;
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (minPrice || maxPrice) {
        filter.pricePerDay = {};
        if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
        if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [vehicles, total] = await Promise.all([
        Vehicle.find(filter)
            .populate("listedBy", "fullname phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Vehicle.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            vehicles,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        }, "Vehicles fetched successfully")
    );
});

// ADMIN: get all vehicles listed by admin
const getMyVehicles = asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find({ listedBy: req.user._id }).sort({
        createdAt: -1
    });

    return res
        .status(200)
        .json(new ApiResponse(200, vehicles, "Your vehicles fetched successfully"));
});

// ANY LOGGED IN USER: get single vehicle by id
const getVehicleById = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findById(vehicleId).populate(
        "listedBy",
        "fullname username avatar phone"
    );

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    if (
        req.user.role === "renter" &&
        vehicle.status !== VEHICLE_STATUS.APPROVED
    ) {
        throw new ApiError(404, "Vehicle not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, vehicle, "Vehicle fetched successfully"));
});

// ADMIN: update vehicle
const updateVehicle = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    if (vehicle.listedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this vehicle");
    }

    const {
        name, type, brand, model, year, pricePerDay, description,
        city, state, vehicleNo, ownerName
    } = req.body;

    if (name) vehicle.name = name;
    if (type) vehicle.type = type;
    if (brand) vehicle.brand = brand;
    if (model) vehicle.model = model;
    if (year) vehicle.year = Number(year);
    if (pricePerDay) vehicle.pricePerDay = Number(pricePerDay);
    if (description !== undefined) vehicle.description = description;
    if (vehicleNo) vehicle.vehicleNo = vehicleNo.trim();
    if (ownerName) vehicle.ownerName = ownerName.trim();
    if (city) vehicle.location.city = city;
    if (state) vehicle.location.state = state;

    if (vehicle.status === VEHICLE_STATUS.APPROVED) {
        vehicle.status = VEHICLE_STATUS.PENDING;
        vehicle.rejectionReason = null;
    }

    await vehicle.save();

    return res
        .status(200)
        .json(new ApiResponse(200, vehicle, "Vehicle updated successfully"));
});

// ADMIN: delete vehicle
const deleteVehicle = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    if (vehicle.listedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this vehicle");
    }

    const deletePromises = vehicle.images.map((img) =>
        deleteFromCloudinary(img.public_id)
    );
    await Promise.all(deletePromises);

    await vehicle.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Vehicle deleted successfully"));
});

// ADMIN: approve vehicle
const approveVehicle = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    if (vehicle.status === VEHICLE_STATUS.APPROVED) {
        throw new ApiError(400, "Vehicle is already approved");
    }

    vehicle.status = VEHICLE_STATUS.APPROVED;
    vehicle.rejectionReason = null;
    await vehicle.save();

    return res
        .status(200)
        .json(new ApiResponse(200, vehicle, "Vehicle approved successfully"));
});

// ADMIN: reject vehicle
const rejectVehicle = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;
    const { reason } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    if (vehicle.status === VEHICLE_STATUS.REJECTED) {
        throw new ApiError(400, "Vehicle is already rejected");
    }

    vehicle.status = VEHICLE_STATUS.REJECTED;
    vehicle.rejectionReason = reason || "Did not meet platform requirements";
    await vehicle.save();

    return res
        .status(200)
        .json(new ApiResponse(200, vehicle, "Vehicle rejected"));
});

export {
    createVehicle,
    getAllVehicles,
    getMyVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    approveVehicle,
    rejectVehicle
};
