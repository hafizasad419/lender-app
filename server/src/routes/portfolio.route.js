import { Router } from "express";
import {
    getPortfolioDetailsController,
    getLenderPortfoliosController,
    uploadDebtController,
    deletePortfolioController,
    submitPortfolioBid,
    getAllBidsOnPortfolio,
    getPortfolioListings
} from "../controllers/portfolio.controller.js";

const portfolioRouter = Router();

portfolioRouter
    .route("/upload")
    .post(uploadDebtController)

portfolioRouter
    .route("/lender/:lenderId")
    .get(getLenderPortfoliosController)


portfolioRouter
    .route("/listings")
    .get(getPortfolioListings)

portfolioRouter
    .route("/listings/:portfolioId")
    .get(getPortfolioDetailsController)

portfolioRouter
    .route("/listings/:portfolioId")
    .delete(deletePortfolioController)

portfolioRouter
    .route("/bid/create")
    .post(submitPortfolioBid)

portfolioRouter
    .route("/bid/:portfolioId")
    .get(getAllBidsOnPortfolio)


export default portfolioRouter;
