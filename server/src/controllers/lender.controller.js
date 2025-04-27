import { getLenderProfileService } from "../services/lender.service.js";
import { handleError } from "../utils/index.js";



export const getLenderProfile = async (req, res) => {
    try {
        const { lenderId } = req.params;

        const lender = await getLenderProfileService(lenderId);

        res.status(200).json({
            success: true,
            message: "Lender profile fetched successfully.",
            lender,
        });

    } catch (error) {
        handleError(res, error, error.statusCode || 500, error.message);
    }
};
