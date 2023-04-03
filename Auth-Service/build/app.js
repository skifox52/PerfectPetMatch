import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import compression from "compression";
import authRouter from "./Routes/authRouter.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
//Routes
app.use("/api/auth", authRouter);
//Error middleware handler
app.use(ErrorHandler);
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => console.log(`Auth service running on port ${process.env.PORT}`));
});
