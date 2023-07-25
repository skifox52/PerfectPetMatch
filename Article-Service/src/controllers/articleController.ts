import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import { ArticleModel } from "../models/ArticleModel.js"
import FormData from "form-data"
import axios from "axios"

//Post an article
export const PostArticle = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { title, content, source } = req.body
    if (!title || !content || !source) throw new Error("Empty fields!")
    const file: Express.Multer.File | undefined = req.file ?? undefined
    let mediaPath: string
    if (file?.buffer !== undefined) {
      const formData = new FormData()
      formData.append("image", file?.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      })
      const mediaResponse = await axios.post(
        `${process.env.MEDIA_SERVICE}/api/media/article` as string,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      )
      const { imagePath } = mediaResponse.data
      mediaPath = imagePath
    }
    await ArticleModel.create({
      title,
      content,
      source,
      image: mediaPath! as string,
    })
    res
      .status(201)
      .json({ success: true, message: "Article ajouter avec succès!" })
  }
)
//Get all articles
export const getAllArticles = expressAsyncHandler(
  async (req: Request<{}, {}, {}, { page: number }>, res: Response) => {
    const { page } = req.query
    const limit: number = 4
    const skip: number = (page - 1) * limit
    const totalPages: number = Math.ceil(
      (await ArticleModel.find().countDocuments()) / limit
    )
    const latestArticle = await ArticleModel.find()
      .sort({ createdAt: -1 })
      .limit(1)
    res.status(200).json({
      latestArticle,
      articles: await ArticleModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      totalPages,
    })
  }
)
//Fetch digle article
export const getArticleById = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const article = await ArticleModel.findById(id)
    res.status(200).json(article)
  }
)
