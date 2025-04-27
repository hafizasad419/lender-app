import { Lender } from "../models/lender.model.js";
import { AppError } from "../utils/index.js";



export const getAllLendersService = async () => {

    // wrap in try catch
    return await Lender.find();
};

// Sign up a new lender
export const signupLenderService = async (name, email, password, role, organization) => {
    try {
        const existingLender = await Lender.findOne({ email });
        if (existingLender) {
            throw new AppError(409, "Lender already exists.");
        }

        const lender = new Lender({
            name,
            email,
            password,
            role, 
            organization
        });

        return await lender.save();
        
    } catch (error) {
        throw new AppError(500, error.message || "Failed to create lender.");
    }
};
//Login lender by verifying credentials

/*
- Login Lender

1. Get lendername and pass from req body.
2. Check if lender exsists - compare email
3. if lender exsists, compare his pass with pass stored in database.
5. if comparison become false, return error.
4. if comparison become successfull, return access and refresh token.
5. Send cookies

*/
export const loginLenderService = async (email, password) => {
    const lender = await Lender.findOne({ email });

    if (!lender) {
        throw new AppError(404, "Lender Not Found");
    }


    const isPasswordValid = await lender.comparePassword(password);

    if (!isPasswordValid) {
        throw new AppError(401, "Invalid Password");
    }

    return lender;
};


export const getLenderProfileService = async (lenderId) => {
    try {
        const lender = await Lender.findById(lenderId)
            .select("name email organization")

        if (!lender) {
            throw new AppError(404, "Lender not found.");
        }

        return lender;
    } catch (error) {
        throw new AppError(500, error.message || "Failed to fetch lender profile.");
    }
};
