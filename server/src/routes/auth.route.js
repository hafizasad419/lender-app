import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/signup").post(signup)
authRouter.route("/login").post(login)
authRouter.route("/logout").post(logout)

export default authRouter;
