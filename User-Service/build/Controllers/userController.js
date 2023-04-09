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
import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import FormData from "form-data";
import axios from "axios";
const UserExist = (mail) => __awaiter(void 0, void 0, void 0, function* () {
    const User = yield UserModel.find({ mail });
    return User.length > 0 ? true : false;
});
//Register a User
export const registerUser = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { nom, prenom, mail, mot_de_passe, sexe, adresse, date_de_naissance, } = req.body;
        if (!nom ||
            !prenom ||
            !mail ||
            !mot_de_passe ||
            !sexe ||
            !adresse ||
            !date_de_naissance) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        if (yield UserExist(mail)) {
            res.status(400);
            throw new Error("User already exists!");
        }
        const file = (_a = req.file) !== null && _a !== void 0 ? _a : undefined;
        //AJAX Reuest to get the fileName and insert the file in the Media-Service
        let mediaPath;
        if ((file === null || file === void 0 ? void 0 : file.buffer) !== undefined) {
            const formData = new FormData();
            formData.append("image", file === null || file === void 0 ? void 0 : file.buffer, {
                filename: file === null || file === void 0 ? void 0 : file.originalname,
                contentType: file === null || file === void 0 ? void 0 : file.mimetype,
            });
            const mediaResponse = yield axios.post(`http://localhost:${process.env.MEDIA_PORT}/api/media/profile`, formData, {
                headers: Object.assign({}, formData.getHeaders()),
            });
            const { imagePath } = mediaResponse.data;
            mediaPath = imagePath;
        }
        const hashedPassword = yield bcrypt.hash(mot_de_passe, 10);
        const newUser = new UserModel({
            nom,
            prenom,
            mail,
            mot_de_passe: hashedPassword,
            sexe: sexe.toLowerCase(),
            adresse,
            date_de_naissance,
            picture: mediaPath,
        });
        const response = yield fetch(`http://localhost:${process.env.AUTH_PORT}/api/auth/token/?_id=${newUser._id}&role:${newUser.role}`);
        yield newUser.save();
        const { accessToken, refreshToken, } = yield response.json();
        res.status(201).json({
            _id: newUser._id,
            role: newUser.role,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Update a User
export const updateUser = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserModel.findByIdAndUpdate(req.user.id, req.body);
        res.status(200).json(`User [${req.user.id}] updated successfully!`);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Delete a User
export const deleteUser = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fetch(`http://localhost:${process.env.AUTH_PORT}/api/auth/refreshToken?_id=${req.user.id}`, {
            method: "DELETE",
        });
        yield UserModel.findByIdAndDelete(req.user._id);
        res.status(200).json(`User [${req.user._id}] deleted successfully!`);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
