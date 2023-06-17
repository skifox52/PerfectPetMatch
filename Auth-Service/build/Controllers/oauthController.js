import expressAsyncHandler from "express-async-handler";
import qs from "querystring";
import "dotenv/config";
import UserModel from "../Models/UserModel.js";
import { SignRefreshToken, SignToken } from "./authController.js";
const getGoogleOauthGoogleToken = async (code) => {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: qs.stringify(values),
        });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Failed to fetch Google oauth Token!");
        throw new Error(error);
    }
};
const getGoogleUser = async ({ id_token, access_token }) => {
    try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Couldn't get Google user!");
        throw new Error(error);
    }
};
//Upsert the User
export const oauthRedirectGoogle = expressAsyncHandler(async (req, res) => {
    try {
        const code = req.query.code;
        const { id_token, access_token } = await getGoogleOauthGoogleToken(code);
        const googleUser = await getGoogleUser({ id_token, access_token });
        if (!googleUser.verified_email) {
            throw new Error("Validation Error Message: Valider votre E-mail");
        }
        const { id, name, given_name, email, family_name, picture } = googleUser;
        const user = await UserModel.userExists(email);
        if (!(await UserModel.userExists(email))) {
            const newUser = await UserModel.create({
                mail: email,
                nom: family_name ? given_name : name,
                prenom: given_name ? given_name : name,
                image: picture,
                googleID: id,
                date_de_naissance: new Date(),
            });
            const accessToken = SignToken({
                _id: newUser._id.toString(),
                role: newUser.role.toString(),
            });
            const refreshToken = SignRefreshToken({
                _id: newUser._id.toString(),
                role: newUser.role.toString(),
            });
            const response = await fetch(`${process.env.GATEWAY_URI}/api/auth/saveRefreshToken`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id: newUser._id.toString(),
                    refreshToken,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch!");
            }
            const queryString = new URLSearchParams({
                _id: newUser._id,
                accessToken,
                refreshToken,
            });
            res.redirect(`${process.env.CLIENT_URI}/google-fill-form?${queryString}`);
        }
        else {
            if ((await UserModel.findOne({ mail: email }))?.mot_de_passe) {
                res.redirect(`${process.env.CLIENT_URI}/login?error=notGoogleAccount`);
            }
            const newUser = await UserModel.findOneAndUpdate({ mail: email }, {
                nom: family_name ? given_name : name,
                prenom: given_name ? given_name : name,
                mail: email,
                image: picture,
                googleID: id,
                date_de_naissance: new Date(),
            });
            if (newUser) {
                const accessToken = SignToken({
                    _id: newUser._id.toString(),
                    role: newUser.role.toString(),
                });
                const refreshToken = SignRefreshToken({
                    _id: newUser._id.toString(),
                    role: newUser.role.toString(),
                });
                const response = await fetch(`${process.env.GATEWAY_URI}/api/auth/saveRefreshToken`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        _id: newUser._id.toString(),
                        refreshToken,
                    }),
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch!");
                }
                const queryString = new URLSearchParams({
                    _id: newUser._id,
                    accessToken,
                    refreshToken,
                });
                res.redirect(`${process.env.CLIENT_URI}/google-fill-form?${queryString}`);
            }
        }
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
