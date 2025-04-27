import bcrypt, { compare } from "bcryptjs";
import mongoose, { Document } from "mongoose"
import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/index.ts";

interface ICollector extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    accessToken: string;
    role: string;
    generateAccessToken: () => string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
    bids: mongoose.Types.ObjectId[];
}

const collectorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['collector', 'lender', 'admin'],
        default: 'collector',
        required: true
    },
    organization: {
        type: String
    },
    accessToken: {
        type: String,
    },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }]
}, { timestamps: true });


collectorSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


collectorSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const collector = this as ICollector; // Explicitly cast `this`
    return await compare(candidatePassword, collector.password);
};

collectorSchema.methods.generateAccessToken = function () {

    const signOptions: SignOptions = {
        // expiresIn: ACCESS_TOKEN_EXPIRY as string
        expiresIn: "7d"
    };

    return jwt.sign(
        { _id: this._id, email: this.email },
        ACCESS_TOKEN_SECRET as Secret,
        signOptions
    );
};


export const Collector = mongoose.model<ICollector>("Collector", collectorSchema);