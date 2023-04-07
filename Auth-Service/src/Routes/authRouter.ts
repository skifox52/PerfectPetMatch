import {
  loginUser,
  logout,
  refreshAccessToken,
  handleTokens,
  deleteRefreshToken,
} from "../Controllers/authController.js"
import { Router } from "express"
const authRouter = Router()

authRouter
  .post("/login", loginUser)
  .get("/token", handleTokens)
  .post("/refresh", refreshAccessToken)
  .delete("/logout", logout)
  .delete("/refreshToken", deleteRefreshToken)
export default authRouter
