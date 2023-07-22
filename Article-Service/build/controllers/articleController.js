import expressAsyncHandler from "express-async-handler";
import { ArticleModel } from "../models/ArticleModel.js";
import FormData from "form-data";
import axios from "axios";
//Post an article
export const PostArticle = expressAsyncHandler(async (req, res) => {
    const { title, content, source } = req.body;
    if (!title || !content || !source)
        throw new Error("Empty fields!");
    const file = req.file ?? undefined;
    let mediaPath;
    if (file?.buffer !== undefined) {
        const formData = new FormData();
        formData.append("image", file?.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        const mediaResponse = await axios.post(`${process.env.MEDIA_SERVICE}/api/media/article`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        const { imagePath } = mediaResponse.data;
        mediaPath = imagePath;
    }
    await ArticleModel.create({
        title,
        content,
        source,
        image: mediaPath,
    });
    res
        .status(201)
        .json({ success: true, message: "Article ajouter avec succès!" });
});
//Get all articles
export const getAllArticles = expressAsyncHandler(async (req, res) => {
    res.status(200).json(await ArticleModel.find());
});
