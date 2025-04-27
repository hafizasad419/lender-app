import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/index.js";


// Define the schema for the Admin model
const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ['collector', 'lender', 'admin'],
            default: 'admin',
            required: true
        },
    },
    { timestamps: true }
);


adminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});



adminSchema.methods.comparePassword = async function
    (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.generateAccessToken = function () {

    const signOptions = {
        // expiresIn: ACCESS_TOKEN_EXPIRY as string
        expiresIn: "7d"
    };

    return jwt.sign(
        { _id: this._id, email: this.email },
        ACCESS_TOKEN_SECRET,
        // ACCESS_TOKEN_SECRET as Secret,
        signOptions
    );
};

// Export the Admin model
export const Admin = mongoose.model("Admin", adminSchema);
