import { Router } from "express";
import { getLenderProfile } from "../controllers/lender.controller.ts";

const lenderRouter = Router();

lenderRouter.route("/profile/:lenderId").get(getLenderProfile)

export default lenderRouter;                    
