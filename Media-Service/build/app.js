import express from "express";
import "dotenv/config";
import compression from "compression";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import multer from "multer";
import sharp from "sharp";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
const upload = multer({
    storage: multer.memoryStorage(),
});
app.post("/api/media/profile", upload.single("image"), expressAsyncHandler(async (req, res) => {
    try {
        const file = req.file;
        const randomId = Date.now();
        const { width, height, format, channels } = await sharp(file?.buffer).metadata();
        await sharp(file?.buffer)
            .resize(500, 500)
            .jpeg({ quality: 80 })
            .toFile(`./assets/ProfilePictures/${randomId}-PofilePicture.${format}`);
        const imagePath = `/assets/ProfilePictures/${randomId}-PofilePicture.${format}`;
        res.json({ imagePath, width, height, format, channels });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Not found Route
app.use("/*", (req, res) => {
    res.status(400);
    throw new Error("Not found!");
});
app.use(ErrorHandler);
app.listen(process.env.PORT, () => console.log(`Media Service running on port ${process.env.PORT}`));
