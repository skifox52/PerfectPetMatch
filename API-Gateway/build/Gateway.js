import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";
import ErrorHandler from "./middleware/ErrorHandler.js";
import authMiddleware from "./middleware/AuthMiddleware.js";
//Exlude non protected API Routes
const excludeUserPaths = ["/api/user/register"];
const proxy = express();
proxy.use(helmet());
proxy.use(morgan("dev"));
//Gateway the user service
proxy.use("/api/user/*", (req, res, next) => {
    if (!excludeUserPaths.includes(req.originalUrl)) {
        authMiddleware("user")(req, res, next);
    }
    else {
        next();
    }
}, createProxyMiddleware({
    target: process.env.USER_SERVICE,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        if (req.headers["x-auth-user"]) {
            proxyReq.setHeader("x-auth-user", req.headers["x-auth-user"]);
        }
    },
}));
//Gateway the post service
proxy.use("/api/post/*", authMiddleware("user"), createProxyMiddleware({
    target: process.env.POST_SERVICE,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        if (req.headers["x-auth-user"]) {
            proxyReq.setHeader("x-auth-user", req.headers["x-auth-user"]);
        }
        console.log(req);
        //ENSURE THAT YOU SEND FILE TO THE HEADER
    },
}));
proxy.use(ErrorHandler);
proxy.listen(process.env.PROXY_PORT, () => console.log(`PROXY running at port ${process.env.PROXY_PORT}`));
