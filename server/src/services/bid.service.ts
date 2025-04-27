import { Bid } from "../models/bid.model.ts";
import { AppError } from "../utils/index.ts";

export const fetchBidsByCollectorIdService = async (collectorId: string) => {
    try {
        const bids = await Bid.find({ collectorId })
            .populate({
                path: "debtPortfolioId",
                select: "name totalPrincipalAmount createdAt"
                // We can customize fields as needed
            })
            .sort({ createdAt: -1 });

        return bids;
    } catch (error: any) {
        throw new AppError(500, error.message || "Failed to fetch bids for collector.");
    }
};
