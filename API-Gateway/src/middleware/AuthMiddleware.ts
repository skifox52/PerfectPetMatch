import expressAsyncHandler from "express-async-handler"
import { RequestHandler, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

type protectType = (role: string) => RequestHandler
const authMiddleware: protectType = (role: string) => {
  return expressAsyncHandler(
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers["authorization"]
        console.log("middleware firing")
        const token =
          authHeader &&
          authHeader.startsWith("Bearer") &&
          authHeader.toString().split(" ")[1]
        if (!token) {
          res.status(400)
          throw new Error("You are not authorized, No token!")
        }
        const tokensData = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET!
        ) as { _id: string; role: string; iat: number; exp: number }
        if (role === "admin" && tokensData.role !== "admin") {
          throw new Error(`Unauthorized! ${role} is required!`)
        }
        req.headers["x-auth-user"] = JSON.stringify(tokensData)
        next()
      } catch (error: any) {
        res.status(400)
        throw new Error(error)
      }
    }
  )
}

export default authMiddleware
