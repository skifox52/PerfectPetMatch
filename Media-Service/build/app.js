var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
app.post("/api/media/profile", upload.single("image"), expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const randomId = Date.now();
        const { width, height, format, channels } = yield sharp(file === null || file === void 0 ? void 0 : file.buffer).metadata();
        yield sharp(file === null || file === void 0 ? void 0 : file.buffer)
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
})));
//Not found Route
app.use("/*", (req, res) => {
    res.status(400);
    throw new Error("Not found!");
});
app.use(ErrorHandler);
app.listen(process.env.PORT, () => console.log(`Media Service running on port ${process.env.PORT}`));
