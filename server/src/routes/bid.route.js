import { Router } from "express";
import { fetchBidsByCollectorId, updateBidStatus } from "../controllers/bid.controller.js";

const bidRouter = Router();

bidRouter
    .route("/collector/:collectorId")
    .get(fetchBidsByCollectorId)

bidRouter
    .route("/update-status/:bidId")
    .patch(updateBidStatus);

export default bidRouter;
