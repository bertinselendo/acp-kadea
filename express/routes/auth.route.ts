import { ExpressAuth } from "@auth/express";
import express from "express";
import { authConfig } from "../config/auth.config";

const authRouter = express.Router();

authRouter.use("/auth/*", ExpressAuth(authConfig));

export default authRouter;
