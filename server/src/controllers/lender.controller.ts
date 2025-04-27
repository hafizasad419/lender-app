import type { Request, Response } from "express";
import { getLenderProfileService } from "../services/lender.service.ts";
import { handleError } from "../utils/index.ts";



export const getLenderProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { lenderId } = req.params;

        const lender = await getLenderProfileService(lenderId);

        res.status(200).json({
            success: true,
            message: "Lender profile fetched successfully.",
            lender,
        });

    } catch (error: any) {
        handleError(res, error, error.statusCode || 500, error.message);
    }
};













