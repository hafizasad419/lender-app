import bcrypt, { compare } from "bcryptjs";
import mongoose, { Document } from "mongoose"
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/index.js";

const lenderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    organization: { type: String },
    accessToken: { type: String },
    role: { type: String, enum: ['collector', 'lender', 'admin'], default: 'lender', required: true },
    portfolios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DebtPortfolio' }],
}, { timestamps: true });

lenderSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


lenderSchema.methods.comparePassword = async function (candidatePassword) {
    const lender = this; 
    return await compare(candidatePassword, lender.password);
};

lenderSchema.methods.generateAccessToken = function () {

    const signOptions = {
        // expiresIn: ACCESS_TOKEN_EXPIRY as string
        expiresIn: "7d"
    };

    return jwt.sign(
        { _id: this._id, email: this.email },
        ACCESS_TOKEN_SECRET,
        signOptions
    );
};


export const Lender = mongoose.model("Lender", lenderSchema);
