import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
const authMiddleware = (role) => {
    return expressAsyncHandler(async (req, res, next) => {
        try {
            const authHeader = req.headers["authorization"];
            console.log("middleware firing");
            const token = authHeader &&
                authHeader.startsWith("Bearer") &&
                authHeader.toString().split(" ")[1];
            if (!token) {
                res.status(400);
                throw new Error("You are not authorized, No token!");
            }
            const tokensData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            if (role === "admin" && tokensData.role !== "admin") {
                throw new Error(`Unauthorized! ${role} is required!`);
            }
            req.headers["x-auth-user"] = JSON.stringify(tokensData);
            next();
        }
        catch (error) {
            res.status(400);
            throw new Error(error);
        }
    });
};
export default authMiddleware;
