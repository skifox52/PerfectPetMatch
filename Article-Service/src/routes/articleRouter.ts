import { Router, Request, Response } from "express"
import multer, { Multer } from "multer"
import {
  PostArticle,
  getAllArticles,
  getArticleById,
} from "../controllers/articleController.js"

const update: Multer = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

export const articleRouter = Router()
  .post("/", update.single("image"), PostArticle)
  .get("/all", getAllArticles)
  .get("/one/:id", getArticleById)
