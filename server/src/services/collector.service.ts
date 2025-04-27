import { Collector } from "../models/collector.model.ts";
import { AppError } from "../utils/index.ts";



export const getAllCollectorsService = async () => {

    // wrap in try catch
    return await Collector.find();
};

// Sign up a new collector
export const signupCollectorService = async (name: string, email: string, password: string, role: string, organization: string) => {
    try {
        const existingCollector = await Collector.findOne({ email });
        if (existingCollector) {
            throw new AppError(409, "Collector already exists.");
        }

        const collector = new Collector({
            name,
            email,
            password,
            role,
            organization
        });

        return await collector.save();

    } catch (error: any) {
        throw new AppError(500, error.message || "Failed to create collector.");
    }
};
//Login collector by verifying credentials

/*
- Login Collector

1. Get collectorname and pass from req body.
2. Check if collector exsists - compare email
3. if collector exsists, compare his pass with pass stored in database.
5. if comparison become false, return error.
4. if comparison become successfull, return access and refresh token.
5. Send cookies

*/
export const loginCollectorService = async (email: string, password: string) => {
    const collector = await Collector.findOne({ email });

    if (!collector) {
        throw new AppError(404, "Collector Not Found");
    }


    const isPasswordValid = await collector.comparePassword(password);

    if (!isPasswordValid) {
        throw new AppError(401, "Invalid Password");
    }

    return collector;
};








