import { Router } from "express";
import { oauthRedirectGoogle } from "../Controllers/oauthController.js";
const oauthRouter = Router();
oauthRouter.get("/google", oauthRedirectGoogle);
export default oauthRouter;
