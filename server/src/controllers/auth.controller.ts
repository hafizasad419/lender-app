import {
    generateAccessToken,
    signupAdminService,
    loginAdminService
} from "../services/auth.service.ts";
import { Admin } from "../models/admin.model.ts";
import { COOKIE_OPTIONS, ROLES } from "../constants.ts";
import { AppError, handleError } from "../utils/index.ts";
import { SECRET_KEY } from "../config/index.ts";
import type { Request, Response } from "express";
import { loginLenderService, signupLenderService } from "../services/lender.service.ts";
import { Lender } from "../models/lender.model.ts";
import { loginCollectorService, signupCollectorService } from "../services/collector.service.ts";
import { Collector } from "../models/collector.model.ts";




// Signup Lender
export const signupLender = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, organization } = req.body;
        // console.log(name, email, password, role, organization);

        if (!name || !email || !password || !role) {
            throw new AppError(400, "All fields are required except organization.")
        }


        const lender = await signupLenderService(name, email, password, role, organization)

        // console.log("Signed Up Lender", lender)

        res.status(201).json({
            message: "Lender Created Successfully",
            id: lender._id.toString()
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            handleError(res, error, error.statusCode, error.message);
        } else {
            handleError(res, error, 500, "Error While Creating Lender");
        }
    }
};


// Login Lender
export const loginLender = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError(400, "Email and Password are required fields.")
        }

        const lender = await loginLenderService(email, password);
        const { accessToken } = await generateAccessToken(lender._id, Lender, "Lender");


        const loggedInLender = await Lender.findById(lender._id).select("-password").lean()



        res.clearCookie("accessToken", COOKIE_OPTIONS)

        res.status(200)
            .cookie("accessToken", accessToken, COOKIE_OPTIONS)
            .json({
                message: "Login Successful",
                lender: loggedInLender,
                accessToken
            });
    }
    catch (error: any) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 401, "Invalid Email or Password");
    }
};


// Signup Collector
export const signupCollector = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, organization } = req.body;

        if (!name || !email || !password || !role) {
            throw new AppError(400, "All fields are required except organization.")
        }


        // console.log(name, email, password);

        const collector = await signupCollectorService(name, email, password, role, organization)


        res.status(201).json({
            message: "Collector Created Successfully",
            id: collector._id.toString()
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            handleError(res, error, error.statusCode, error.message);
        } else {
            handleError(res, error, 500, "Error While Creating Collector");
        }
    }
};



// Login Collector
export const loginCollector = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError(400, "Email and Password are required fields.")
        }

        const collector = await loginCollectorService(email, password);
        const { accessToken } = await generateAccessToken(collector._id, Collector, "Collector");

        const loggedInCollector = await Collector.findById(collector._id).select("-password").lean()



        res.clearCookie("accessToken", COOKIE_OPTIONS)

        res.status(200)
            .cookie("accessToken", accessToken, COOKIE_OPTIONS)
            .json({
                message: "Login Successful",
                collector: loggedInCollector,
                accessToken
            });
    }
    catch (error: any) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 401, "Invalid Email or Password");
    }
};


// Signup Admin
export const signupAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password, secretKey } = req.body;

        if (!name || !email || !password || !secretKey) {
            throw new AppError(400, "All fields are required.")
        }

        // console.log("Received Secret Key:", secretKey);
        // console.log("Loaded Secret Key:", SECRET_KEY);
        if (secretKey !== SECRET_KEY) {
            throw new AppError(401, "Invalid Secret Key");
        }

        const admin = await signupAdminService(name, email, password)

        res.status(201).json({
            message: "Admin Created Successfully",
            id: admin._id.toString()
        });

    } catch (error) {
        if (error instanceof AppError) {
            handleError(res, error, error.statusCode, error.message);
        } else {
            handleError(res, error, 500, "Error While Creating Admin");
        }
    }
};


// Login Controller
export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password, secretKey } = req.body;

        if (secretKey !== SECRET_KEY) {
            throw new AppError(401, "Invalid Secret Key");
        }

        const admin = await loginAdminService(email, password);
        const { accessToken } = await generateAccessToken(admin._id, Admin, "Admin");


        const loggedInAdmin = await Admin
            .findById(admin._id)
            .select("-password")
            .lean()


        res.clearCookie("accessToken", COOKIE_OPTIONS)

        res.status(200)
            .cookie("accessToken", accessToken, COOKIE_OPTIONS)
            .json({
                message: "Login Successful",
                admin: loggedInAdmin,
                accessToken
            });
    }
    catch (error) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 401, "Invalid Email or Password");
    }
};


// single function to handle login by invoking current controllers as functions
export const login = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;

        if (role === ROLES.ADMIN) {
            await loginAdmin(req, res);
        }
        else if (role === ROLES.LENDER) {
            await loginLender(req, res);
        }
        else if (role === ROLES.COLLECTOR) {
            await loginCollector(req, res);
        }
        else {
            throw new AppError(400, "Invalid User Type.");
        }
    } catch (error) {
        handleError(res, error, 500, "Error While Logging In");
    }
}


export const signup = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;

        if (role === ROLES.ADMIN) {
            await signupAdmin(req, res);
        }
        else if (role === ROLES.LENDER) {
            await signupLender(req, res);
        }
        else if (role === ROLES.COLLECTOR) {
            await signupCollector(req, res);
        }
        else {
            throw new AppError(400, "Invalid User Type.");
        }
    } catch (error) {
        handleError(res, error, 500, "Error While Signing Up");
    }
};


// Logout Admin
export const logoutAdmin = async (req: Request, res: Response) => {
    try {
        res.clearCookie("accessToken", COOKIE_OPTIONS);
        res.status(200).json({ message: "Admin Logout Successful" });
    } catch (error) {
        handleError(res, error, 500, "Error While Logging Out Admin");
    }
};

// Logout Collector
export const logoutCollector = async (req: Request, res: Response) => {
    try {
        res.clearCookie("accessToken", COOKIE_OPTIONS);
        res.status(200).json({ message: "Collector Logout Successful" });
    } catch (error) {
        handleError(res, error, 500, "Error While Logging Out Collector");
    }
};

// Logout Lender
export const logoutLender = async (req: Request, res: Response) => {
    try {
        res.clearCookie("accessToken", COOKIE_OPTIONS);
        res.status(200).json({ message: "Lender Logout Successful" });
    } catch (error) {
        handleError(res, error, 500, "Error While Logging Out Lender");
    }
};

// Single Logout Handler
export const logout = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;

        if (role === ROLES.ADMIN) {
            await logoutAdmin(req, res);
        } else if (role === ROLES.LENDER) {
            await logoutLender(req, res);
        } else if (role === ROLES.COLLECTOR) {
            await logoutCollector(req, res);
        } else {
            throw new AppError(400, "Invalid User Role");
        }
    } catch (error) {
        handleError(res, error, 500, "Error While Logging Out");
    }
};
