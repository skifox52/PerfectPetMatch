import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import UserModel from "../Models/UserModel.js";
import RefreshTokenModel from "../Models/RefreshTokenModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
export const SignToken = ({ _id, role }) => {
    //Do not forget to change the 10h to 10m
    return jwt.sign({ _id, role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "100000h",
    });
};
export const SignRefreshToken = ({ _id, role }) => {
    return jwt.sign({ _id, role }, process.env.REFRESH_TOKEN_SECRET);
};
const RefreshTokenExists = async (refreshToken) => {
    const refreshExists = await RefreshTokenModel.find({ refreshToken });
    return refreshExists.length > 0 ? true : false;
};
//Login a User
export const loginUser = expressAsyncHandler(async (req, res) => {
    try {
        const { mail, password } = req.body;
        if (!mail || !password) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        //Check User if Exists
        if (!(await UserModel.userExists(mail))) {
            res.status(400);
            throw new Error("User doesn't exist!");
        }
        const User = await UserModel.find({ mail });
        const passwordMatch = await bcrypt.compare(password, User[0].mot_de_passe);
        if (!passwordMatch) {
            res.status(400);
            throw new Error("Password doesn't match!");
        }
        const accessToken = SignToken({
            _id: User[0]._id.toString(),
            role: User[0].role.toString(),
        });
        const refreshToken = SignRefreshToken({
            _id: User[0]._id.toString(),
            role: User[0].role.toString(),
        });
        await RefreshTokenModel.create({
            idUtilisateur: User[0]._id,
            refreshToken,
        });
        res.status(200).json({
            _id: User[0]._id,
            accessToken,
            refreshToken,
            role: User[0].role,
        });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Refresh Access token
export const refreshAccessToken = expressAsyncHandler(async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error("No token");
        }
        if (!(await RefreshTokenExists(refreshToken))) {
            res.status(400);
            throw new Error("Invalid refresh token!");
        }
        const { iat, ...data } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = SignToken(data);
        res.status(200).json({ token: newAccessToken });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Logout
export const logout = expressAsyncHandler(async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error("No refreshToken provided!");
        }
        await RefreshTokenModel.deleteOne({ refreshToken });
        res.status(200).json("User logged out successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Utilie Endpoints for COMMUNICATION
//Generate access token and refreshToken
export const handleTokens = expressAsyncHandler(async (req, res) => {
    try {
        const { _id, role } = req.query;
        const accessToken = SignToken({ _id, role });
        const refreshToken = SignRefreshToken({ _id, role });
        await RefreshTokenModel.create({
            idUtilisateur: _id,
            refreshToken,
        });
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Delete refreshToken after delete if user online
export const deleteRefreshToken = expressAsyncHandler(async (req, res) => {
    try {
        const { _id } = req.params;
        await RefreshTokenModel.deleteOne({ idUtilisateur: _id });
        res.status(200).end();
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
