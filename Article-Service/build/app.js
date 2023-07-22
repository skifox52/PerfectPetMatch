import express from "express";
import morgan from "morgan";
import compression from "compression";
import { connect } from "mongoose";
import helmet from "helmet";
import "dotenv/config";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import { articleRouter } from "./routes/articleRouter.js";
const app = express();
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Routes
app.use("/api/article", articleRouter);
app.use("/*", (req, res) => {
    res.status(404);
    throw new Error("Not found!");
});
//Error handler middleware
app.use(ErrorHandler);
connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(process.env.PORT, () => console.log(`Articles service listenning on port ${process.env.PORT}`));
})
    .catch((err) => console.log(err));
