import { fetchBidsByCollectorIdService, updateBidStatusService } from "../services/bid.service.js";
import { AppError, handleError } from "../utils/index.js";

export const fetchBidsByCollectorId = async (req, res) => {
    try {
        const { collectorId } = req.params;

        if (!collectorId) {
            throw new AppError(400, "Collector ID is required.");
        }

        const bids = await fetchBidsByCollectorIdService(collectorId);

        res.status(200).json({
            success: true,
            message: "Bids fetched successfully.",
            bids,
        });
    } catch (error) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 500, "Failed to fetch bids");
    }
};



export const updateBidStatus = async (req, res) => {
    try {
        const { bidId } = req.params;
        const { status } = req.body;

        if (!bidId || !status) {
            throw new AppError(400, "Bid ID and status are required.");
        }

        const updatedBid = await updateBidStatusService(bidId, status);

        res.status(200).json({
            success: true,
            message: "Bid status updated successfully.",
            bid: updatedBid,
        });
    } catch (error) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 500, "Failed to update bid status");
    }
};
