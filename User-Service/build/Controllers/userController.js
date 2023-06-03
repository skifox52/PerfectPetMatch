import expressAsyncHandler from "express-async-handler";
import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import FormData from "form-data";
import axios from "axios";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { Types } from "mongoose";
//Register a User
export const registerUser = expressAsyncHandler(async (req, res) => {
    try {
        const { nom, prenom, mail, mot_de_passe, sexe, adresse, date_de_naissance, ville, } = req.body;
        if (!nom ||
            !prenom ||
            !mail ||
            !mot_de_passe ||
            !sexe ||
            !adresse ||
            !date_de_naissance ||
            !ville) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        if (await UserModel.userExists(mail)) {
            res.status(400);
            throw new Error("L'utilisateur existe déjà");
        }
        const file = req.file ?? undefined;
        //AJAX Reuest to get the fileName and insert the file in the Media-Service
        let mediaPath;
        if (file?.buffer !== undefined) {
            const formData = new FormData();
            formData.append("image", file?.buffer, {
                filename: file?.originalname,
                contentType: file?.mimetype,
            });
            const mediaResponse = await axios.post(process.env.MEDIA_SERVICE_URI, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });
            const { imagePath } = mediaResponse.data;
            mediaPath = imagePath;
        }
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        const newUser = new UserModel({
            nom,
            prenom,
            mail,
            mot_de_passe: hashedPassword,
            sexe: sexe.toLowerCase(),
            adresse,
            date_de_naissance,
            image: mediaPath,
            ville,
        });
        const response = await fetch(`http://localhost:${process.env.AUTH_PORT}/api/auth/token/?_id=${newUser._id}&role=${newUser.role}`);
        await newUser.save();
        const { accessToken, refreshToken, } = await response.json();
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
});
//Update a User
export const updateUser = expressAsyncHandler(async (req, res) => {
    try {
        const user = JSON.parse(req.headers["x-auth-user"]);
        await UserModel.findByIdAndUpdate(user._id, req.body);
        res.status(200).json(`User [${user._id}] updated successfully!`);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Delete a User
export const deleteUser = expressAsyncHandler(async (req, res) => {
    try {
        await fetch(`http://localhost:${process.env.AUTH_PORT}/api/auth/refreshToken?_id=${req.user.id}`, {
            method: "DELETE",
        });
        await UserModel.findByIdAndDelete(req.user._id);
        res.status(200).json(`User [${req.user._id}] deleted successfully!`);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Reset password form
export const resetPasswordForm = expressAsyncHandler(async (req, res) => {
    try {
        const { mail } = req.body;
        if (!(await UserModel.userExists(mail))) {
            throw new Error("User doesn't exist!");
        }
        const keyExist = await UserModel.keyExists(mail);
        let randomKey;
        if (!keyExist) {
            let generatedKey = crypto.randomBytes(30).toString("hex");
            randomKey = generatedKey;
            await UserModel.findOneAndUpdate({ mail }, { resetKey: randomKey });
        }
        else {
            randomKey = keyExist;
        }
        const url = `${process.env.CLIENT_SERVICE}/resetPassword?${new URLSearchParams(`key=${randomKey}`)}`;
        //Create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        //Send mail
        const info = await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: mail,
            subject: "Réinitialisation du mot de passe",
            text: `Voici le lien de réinitialisation du mot de passe pour votre compte Perfect pet match: ${url}`,
        });
        res.status(200).json({
            success: true,
            message: "E-mail sent successfully!",
        });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Check if reset key is valid
export const resetKeyIsValid = expressAsyncHandler(async (req, res) => {
    try {
        const { key } = req.body;
        if (!key) {
            throw new Error("Invalide key!");
        }
        let exist = {
            exist: false,
            mail: null,
        };
        const user = await UserModel.findOne({ resetKey: key });
        if (user) {
            exist = { exist: true, mail: user.mail };
        }
        res.status(200).json(exist);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Reset password [Updata user password]
export const updateUserPassword = expressAsyncHandler(async (req, res) => {
    try {
        const { mail } = req.query;
        const { password } = req.body;
        if (!password) {
            throw new Error("Empty fields!");
        }
        const cryptedPassword = await bcrypt.hash(password, 10);
        await UserModel.findOneAndUpdate({ mail }, { mot_de_passe: cryptedPassword });
        res.status(200).json("Password reset successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Get user by id
export const findUserById = expressAsyncHandler(async (req, res) => {
    try {
        const { _id } = req.query;
        const user = await UserModel.findById(_id);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Get user by mail
export const findUserByMail = expressAsyncHandler(async (req, res) => {
    try {
        const { mail } = req.query;
        const user = await UserModel.findOne({ mail });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Get All users
export const findAllUsers = expressAsyncHandler(async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Update the user after google auth
export const updateGoogleUser = expressAsyncHandler(async (req, res) => {
    try {
        const { _id } = req.query;
        console.log(_id);
        const user = await UserModel.findByIdAndUpdate(new Types.ObjectId(_id), req.body, { new: true });
        console.log(user);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
