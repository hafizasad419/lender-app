import { Bid } from "../models/bid.model.js";
import { AppError } from "../utils/index.js";

export const fetchBidsByCollectorIdService = async (collectorId) => {
    try {
        const bids = await Bid.find({ collectorId })
            .populate({
                path: "debtPortfolioId",
                select: "name totalPrincipalAmount createdAt"
                // We can customize fields as needed
            })
            .sort({ createdAt: -1 });

        return bids;
    } catch (error) {
        throw new AppError(500, error.message || "Failed to fetch bids for collector.");
    }
};
