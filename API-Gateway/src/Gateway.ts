import express, { Express, NextFunction, Response, Request } from "express"
import helmet from "helmet"
import morgan from "morgan"
import { createProxyMiddleware } from "http-proxy-middleware"
import "dotenv/config"
import ErrorHandler from "./middleware/ErrorHandler.js"
import authMiddleware from "./middleware/AuthMiddleware.js"

//Exlude non protected API Routes
const excludeUserPaths = ["/api/user/register"]

const proxy: Express = express()
proxy.use(helmet())
proxy.use(morgan("dev"))

proxy.use(
  "/api/user/*",
  (req: Request, res: Response, next: NextFunction) => {
    if (!excludeUserPaths.includes(req.originalUrl)) {
      authMiddleware("user")(req, res, next)
    } else {
      next()
    }
  },
  createProxyMiddleware({
    target: process.env.USER_SERVICE,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.headers["x-auth-user"]) {
        proxyReq.setHeader("x-auth-user", req.headers["x-auth-user"])
      }
    },
  })
)

proxy.use(ErrorHandler)
proxy.listen(process.env.PROXY_PORT, () =>
  console.log(`PROXY running at port ${process.env.PROXY_PORT}`)
)
