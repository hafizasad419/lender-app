import { Router } from "express";
import { fetchBidsByCollectorId } from "../controllers/bid.controller.js";

const bidRouter = Router();

bidRouter
    .route("/collector/:collectorId")
    .get(fetchBidsByCollectorId)


export default bidRouter;
