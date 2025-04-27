import type { Request, Response } from "express";
import { AppError, handleError } from "../utils/index.ts";
import {
    getLenderPortfoliosService,
    getLenderDebtEntries,
    deletePortfolioService, getPortfolioListingsService, uploadDebtService, submitPortfolioBidService, getAllBidsOnPortfolioService, getPortfolioDetailsService
} from "../services/portfolio.service.ts";


export const uploadDebtController = async (req: Request, res: Response) => {
    try {
        const { lenderId, debts, portfolioName } = req.body;

        if (!lenderId || !debts || !Array.isArray(debts) || debts.length === 0) {
            throw new AppError(400, "Invalid request: lenderId and debts array are required.");
        }

        const result = await uploadDebtService({ lenderId, debts, portfolioName });

        res.status(200).json({
            success: true,
            message: result.message,
            portfolioId: result.portfolioId
        });
    } catch (error: any) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 401, "Invalid Email or Password");
    }
};


export const getLenderPortfoliosController = async (req: Request, res: Response) => {
    try {
        const { lenderId } = req.params;

        if (!lenderId) {
            throw new AppError(400, "Missing lenderId in request parameters.");
        }

        const portfolios = await getLenderPortfoliosService(lenderId);

        res.status(200).json({
            success: true,
            message: "Lender portfolios fetched successfully.",
            portfolios,
        });
    } catch (error: any) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 500, "Failed to get lender portfolios");
    }
};



export const deletePortfolioController = async (req: Request, res: Response) => {
    try {
        const { portfolioId } = req.params;

        if (!portfolioId) {
            throw new AppError(400, "Portfolio ID is required.");
        }

        const result = await deletePortfolioService(portfolioId);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error: any) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 500, "Failed to delete portfolio");
    }
};



export const getPortfolioDetailsController = async (req: Request, res: Response) => {
    try {
        const { portfolioId } = req.params;

        if (!portfolioId) {
            throw new AppError(400, "Portfolio ID is required.");
        }

        const portfolioDetails = await getPortfolioDetailsService(portfolioId);

        res.status(200).json({
            success: true,
            message: "Portfolio details fetched successfully.",
            data: portfolioDetails
        });

    } catch (error: any) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 500, "Failed to fetch portfolio details");
    }
};



export const getLenderDebtEntriesController = async (req: Request, res: Response) => {
    try {
        const { lenderId } = req.params;

        if (!lenderId) {
            throw new AppError(400, "Lender ID is required.");
        }

        const debtEntries = await getLenderDebtEntries(lenderId);

        res.status(200).json({
            success: true,
            message: "Debt entries fetched successfully.",
            debtEntries
        });
    } catch (error: any) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 500, "Failed to fetch debt entries");
    }
};


export const getPortfolioListings = async (req: Request, res: Response): Promise<void> => {
    try {
        const listings = await getPortfolioListingsService(req.query);
        res.status(200).json({ listings });
    } catch (error) {
        handleError(res, error, 500, "Failed to fetch debt listings");
    }
};



export const submitPortfolioBid = async (req: Request, res: Response) => {

    const { portfolioId, collectorId, bidType, bidAmount } = req.body
    try {
        const submittedBid = await submitPortfolioBidService(
            portfolioId,
            collectorId,
            bidType,
            bidAmount
        )
        res.status(200).json({
            submittedBid,
            success: "true",
            message: "Bid submitted successfully."
        });

    } catch (error: any) {
        handleError(res, error, 500, "Failed to submit bid.");
    }


}


export const getAllBidsOnPortfolio = async (req: Request, res: Response) => {
    try {
        const { portfolioId } = req.params;

        if (!portfolioId) {
            throw new AppError(400, "Portfolio ID is required.");
        }

        const bids = await getAllBidsOnPortfolioService(portfolioId);

        res.status(200).json({
            success: true,
            message: "Bids fetched successfully.",
            bids,
        });
    } catch (error: any) {
        handleError(res, error, error instanceof AppError ? error.statusCode : 500, "Failed to fetch bids");
    }
};
