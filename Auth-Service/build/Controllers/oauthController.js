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
import qs from "querystring";
import "dotenv/config";
const getGoogleOauthGoogleToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
    };
    try {
        const response = yield fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: qs.stringify(values),
        });
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error("Failed to fetch Google oauth Token!");
        throw new Error(error);
    }
});
const getGoogleUser = ({ id_token, access_token }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        });
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error("Couldn't get Google user!");
        throw new Error(error);
    }
});
export const oauthRedirectGoogle = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        const { id_token, access_token } = yield getGoogleOauthGoogleToken(code);
        const googleUser = yield getGoogleUser({ id_token, access_token });
        console.log({ googleUser });
        //Upsert User
    }
    catch (error) { }
}));
