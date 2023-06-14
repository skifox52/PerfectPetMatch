import {
  loginUser,
  logout,
  refreshAccessToken,
  handleTokens,
  deleteRefreshToken,
  saveRefresh,
} from "../Controllers/authController.js"
import { Router } from "express"
const authRouter = Router()

authRouter
  .post("/login", loginUser)
  .get("/token", handleTokens)
  .post("/refresh", refreshAccessToken)
  .delete("/logout", logout)
  .delete("/refreshToken", deleteRefreshToken)
  .post("/saveRefreshToken", saveRefresh)
export default authRouter
