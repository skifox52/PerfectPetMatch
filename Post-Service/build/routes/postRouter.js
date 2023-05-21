import { Router } from "express";
import multer, { memoryStorage } from "multer";
import { postPost } from "../controllers/postController.js";
//Setup upload
const upload = multer({
    storage: memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024,
    },
});
const postRouter = Router().post("/", upload.array("images"), postPost);
export default postRouter;
