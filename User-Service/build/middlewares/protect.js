var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
const protect = expressAsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader &&
            authHeader.startsWith("Bearer") &&
            authHeader.toString().split(" ")[1];
        if (!token) {
            res.status(400);
            throw new Error("You are not authorized, No token!");
        }
        const tokensData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = tokensData;
        next();
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
export default protect;
