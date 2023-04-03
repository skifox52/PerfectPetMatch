var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import UserModel from "../Models/UserModel.js";
import RefreshTokenModel from "../Models/RefreshTokenModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
const UserExist = (mail) => __awaiter(void 0, void 0, void 0, function* () {
    const User = yield UserModel.find({ mail });
    return User.length > 0 ? true : false;
});
const SignToken = (id) => {
    //Do not forget to change the 10h to 10m
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10h",
    });
};
const SignRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
};
const RefreshTokenExists = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshExists = yield RefreshTokenModel.find({ refreshToken });
    return refreshExists.length > 0 ? true : false;
});
//Login a User
export const loginUser = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mail, password } = req.body;
        if (!mail || !password) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        //Check User if Exists
        if (!(yield UserExist(mail))) {
            res.status(400);
            throw new Error("User doesn't exist!");
        }
        const User = yield UserModel.find({ mail });
        const passwordMatch = yield bcrypt.compare(password, User[0].mot_de_passe);
        if (!passwordMatch) {
            res.status(400);
            throw new Error("Password doesn't match!");
        }
        const accessToken = SignToken(User[0]._id.toString());
        const refreshToken = SignRefreshToken(User[0]._id.toString());
        yield RefreshTokenModel.create({
            idUtilisateur: User[0]._id,
            refreshToken,
        });
        res.status(200).json({
            id_user: User[0]._id,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Refresh Access token
export const refreshAccessToken = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error("No token");
        }
        if (!(yield RefreshTokenExists(refreshToken))) {
            res.status(400);
            throw new Error("Invalid refresh token!");
        }
        const _a = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET), { iat } = _a, data = __rest(_a, ["iat"]);
        const newAccessToken = SignToken(data);
        res.status(200).json({ token: newAccessToken });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Logout
export const logout = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error("No refreshToken provided!");
        }
        yield RefreshTokenModel.deleteOne({ refreshToken });
        res.status(200).json("User logged out successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Utilie Endpoints for COMMUNICATION
//Generate access token and refreshToken
export const handleTokens = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = (_b = req.params.id) === null || _b === void 0 ? void 0 : _b.toString();
        const accessToken = SignToken(id);
        const refreshToken = SignRefreshToken(id);
        yield RefreshTokenModel.create({
            idUtilisateur: id,
            refreshToken,
        });
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
