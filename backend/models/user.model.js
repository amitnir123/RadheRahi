import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../constants.js";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.RENTER
        },
        phone: {
            type: String,
            trim: true,
            default: null
        },
        avatar: {
            url: {
                type: String,
                default: null,
                trim: true
            },
            public_id: {
                type: String,
                default: null,
                trim: true
            }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        refreshToken: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

const User = mongoose.model("User", userSchema);
export default User;