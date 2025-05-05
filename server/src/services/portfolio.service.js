import { DebtEntry } from "../models/debtEntry.model.js";
import { Lender } from "../models/lender.model.js";
import { Collector } from "../models/collector.model.js";
import { DebtPortfolio } from "../models/debtPortfolio.model.js";
import { AppError } from "../utils/index.js";
import { Bid } from "../models/bid.model.js";



export const uploadDebtService = async (
    { lenderId, debts, portfolioName, debtType }
) => {
    try {
        if (!lenderId || !debts?.length || !debtType) {
            throw new AppError(400, "Lender ID, debtType and debts are required.");
        }

        const lender = await Lender.findById(lenderId);
        if (!lender) {
            throw new AppError(404, "Lender not found.");
        }

        // Calculate portfolio totals
        const totalPrincipalAmount = debts.reduce((acc, debt) => acc + (debt.principalAmount || 0), 0);
        const totalDebts = debts.length;

        // Step 1: Create new portfolio
        const portfolio = new DebtPortfolio({
            lenderId,
            name: portfolioName || `Portfolio-${Date.now()}`, // Optional: dynamic name
            debtType,
            totalDebts,
            totalPrincipalAmount
        });

        await portfolio.save();

        // Step 2: Prepare DebtEntry objects
        const debtEntries = debts.map(debt => ({
            ...debt,
            lenderId,
            portfolioId: portfolio._id
        }));

        // Step 3: Insert all entries in bulk
        await DebtEntry.insertMany(debtEntries);

        // Step 4: Push portfolio to lender
        lender.portfolios.push(portfolio._id);
        await lender.save();

        return {
            message: "Portfolio and debts uploaded successfully.",
            portfolioId: portfolio._id
        };
    } catch (error) {
        console.error("uploadDebtService error:", error);
        throw new AppError(500, error.message || "Failed to upload debt portfolio.");
    }
};


export const getLenderPortfoliosService = async (lenderId) => {
    try {
        const portfolios = await DebtPortfolio.find({ lenderId }).sort({ createdAt: -1 });
        return portfolios;
    } catch (error) {
        throw new AppError(500, error?.message || "Failed to get lender portfolios.");
    }
};


export const getPortfolioDetailsService = async (portfolioId) => {
    if (!portfolioId) {
        throw new AppError(400, "Portfolio ID is required.");
    }

    // 1. Fetch the portfolio
    const portfolio = await DebtPortfolio.findById(portfolioId)
        .populate({
            path: 'lenderId',
            select: 'name email' // include lender details
        });

    if (!portfolio) {
        throw new AppError(404, "Portfolio not found.");
    }

    // 2. Fetch debt entries under this portfolio
    const debtEntries = await DebtEntry.find({ portfolioId });

    // 3. Fetch all bids made on this portfolio
    const bids = await Bid.find({ debtPortfolioId: portfolioId })
        .populate({
            path: 'collectorId',
            select: 'name email organization'
        });

    return {
        portfolio,
        debtEntries,
        bids
    };
};



export const deletePortfolioService = async (portfolioId) => {
    try {
        if (!portfolioId) {
            throw new AppError(400, "Portfolio ID is required.");
        }

        const portfolio = await DebtPortfolio.findById(portfolioId);
        if (!portfolio) {
            throw new AppError(404, "Portfolio not found.");
        }

        // Delete all related debt entries
        await DebtEntry.deleteMany({ portfolioId });

        // Remove portfolio from lender's portfolio array
        await Lender.findByIdAndUpdate(portfolio.lenderId, {
            $pull: { portfolios: portfolioId }
        });

        // Delete the portfolio itself
        await DebtPortfolio.findByIdAndDelete(portfolioId);

        return { message: "Portfolio and associated debt entries deleted successfully." };
    } catch (error) {
        throw new AppError(500, error?.message || "Failed to delete portfolio.");
    }
};


export const getCollectorBids = async (collectorId) => {
    try {
        const collector = await Collector
            .findById(collectorId)
            .populate('bids');
        return collector?.bids || [];
    } catch (error) {
        throw new AppError(500, error?.message || "Failed to get collector bids.");
    }
};

export const getLenderDebtEntries = async (lenderId) => {
    try {
        const debtEntries = await DebtEntry.find({ lenderId })
            .populate('portfolioId')  // Populate portfolio data to get portfolio details
            .populate('portfolioId.lenderId');  // Optionally populate lender info in the portfolio

        return debtEntries;
    } catch (error) {
        throw new AppError(500, error?.message || "Failed to get debt entries.");
    }
};


export const getPortfolioListingsService = async (params = {}) => {
    const page = Number(params.page) > 0 ? Number(params.page) : 1;
    const limit = Number(params.limit) > 0 ? Number(params.limit) : 6;
    const skip = (page - 1) * limit;

    const sortField = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder === "asc" ? 1 : -1;

    const portfolios = await DebtPortfolio.aggregate([
        {
            $sort: { [sortField]: sortOrder }
        },
        {
            $lookup: {
                from: "debtentries",
                localField: "_id",
                foreignField: "portfolioId",
                as: "debts"
            }
        },
        {
            $lookup: {
                from: "lenders",
                localField: "lenderId",
                foreignField: "_id",
                as: "lender"
            }
        },
        {
            $unwind: "$lender"
        },
        {
            $addFields: {
                portfolioId: "$_id",
                postedDaysAgo: {
                    $floor: {
                        $divide: [
                            { $subtract: [new Date(), "$createdAt"] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                },
                averageDebtAgeInMonths: {
                    $cond: {
                        if: { $gt: [{ $size: "$debts" }, 0] },
                        then: { $avg: "$debts.debtAgeInMonths" },
                        else: 0
                    }
                },
                averageDebtSize: {
                    $cond: {
                        if: { $gt: [{ $size: "$debts" }, 0] },
                        then: { $avg: "$debts.principalAmount" },
                        else: 0
                    }
                },
                totalDebtors: { $size: "$debts" },
                lenderName: "$lender.name",
                lenderOrganization: "$lender.organization"
            }
        },
        {
            $project: {
                _id: 0,
                portfolioId: 1,
                postedDaysAgo: 1,
                portfolioName: "$name",
                portfolioFaceValue: "$totalPrincipalAmount",
                averageDebtAgeInMonths: 1,
                averageDebtSize: 1,
                totalDebtors: 1,
                lenderName: 1,
                lenderOrganization: 1,
                status: 1,
                debtType: 1  
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]);

    const totalCount = await DebtPortfolio.countDocuments();

    return {
        data: portfolios,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
    };
};



export const submitPortfolioBidService = async (
    portfolioId,
    collectorId,
    bidType,
    bidAmount
) => {
    try {
        const portfolio = await DebtPortfolio.findById(portfolioId);
        if (!portfolio) {
            throw new AppError(404, "Portfolio not found.");
        }

        const collector = await Collector.findById(collectorId);
        if (!collector) {
            throw new AppError(404, "Collector not found.");
        }

        // Check for existing bid
        const existingBid = await Bid.findOne({
            collectorId,
            debtPortfolioId: portfolioId,
        });

        if (existingBid) {
            // Update existing bid
            existingBid.type = bidType;
            existingBid.amount = bidAmount;
            existingBid.updatedAt = new Date();
            await existingBid.save();
            return existingBid;
        }

        // Create new bid
        const bid = new Bid({
            collectorId,
            debtPortfolioId: portfolioId,
            type: bidType,
            amount: bidAmount,
        });

        await bid.save();
        return bid;

    } catch (error) {
        throw new AppError(500, error?.message || "Failed to submit bid.");
    }
};




export const getAllBidsOnPortfolioService = async (portfolioId) => {
    try {
        const portfolio = await DebtPortfolio.findById(portfolioId);
        if (!portfolio) {
            throw new AppError(404, "Portfolio not found.");
        }

        const bids = await Bid.find({ debtPortfolioId: portfolioId })
            .populate("collectorId", "name email organization");

        return bids;
    } catch (error) {
        throw new AppError(500, error?.message || "Failed to fetch bids.");
    }
};
