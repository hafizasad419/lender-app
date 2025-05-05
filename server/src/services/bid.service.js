import { BID_STATUSES } from "../constants.js";
import { Bid } from "../models/bid.model.js";
import { AppError } from "../utils/index.js";
import { DebtPortfolio } from "../models/debtPortfolio.model.js"; 
import mongoose from "mongoose"

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




export const updateBidStatusService = async (bidId, newStatus) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Ensure status is valid
        if (!BID_STATUSES.includes(newStatus)) {
            throw new AppError(400, "Invalid bid status.");
        }

        // Find the bid
        const bid = await Bid.findById(bidId).session(session);
        if (!bid) {
            throw new AppError(404, "Bid not found.");
        }

        // Update bid status
        bid.status = newStatus;
        await bid.save({ session });

        // If bid is accepted, update debtPortfolio status to 'accepted'
        if (newStatus === "accepted") {
            const portfolio = await DebtPortfolio.findById(bid.debtPortfolioId).session(session);
            if (!portfolio) {
                throw new AppError(404, "Debt Portfolio not found.");
            }

            // Change portfolio status to 'accepted'
            portfolio.status = 'accepted';
            await portfolio.save({ session });
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return bid;  // Return the updated bid
    } catch (error) {
        // If anything goes wrong, abort the transaction
        await session.abortTransaction();
        session.endSession();

        throw new AppError(500, error.message || "Failed to update bid status.");
    }
};

