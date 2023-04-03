import { loginUser, logout, refreshAccessToken, handleTokens, } from "../Controllers/authController.js";
import { Router } from "express";
const authRouter = Router();
authRouter
    .post("/login", loginUser)
    .get("/token/:id", handleTokens)
    .post("/refresh", refreshAccessToken)
    .delete("/logout", logout);
export default authRouter;
