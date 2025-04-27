import { Router } from "express";
import { getLenderProfile } from "../controllers/lender.controller.js";

const lenderRouter = Router();

lenderRouter.route("/profile/:lenderId").get(getLenderProfile)

export default lenderRouter;                    
