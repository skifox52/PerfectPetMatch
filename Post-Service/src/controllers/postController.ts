import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import { PostModel } from "../models/PostModel.js"
import FormData from "form-data"
import axios from "axios"
import "dotenv/config"

//Get all posts
const getAllPosts = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const allPosts = await PostModel.find({})
      res.status(200).json(allPosts)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)

//Post a post
export const postPost = expressAsyncHandler(
  async (req: any, res: Response): Promise<void> => {
    const { _id } =
      req.headers["x-auth-user"] && JSON.parse(req.headers["x-auth-user"])
    try {
      const { title, content } = req.body
      if (!title || !content) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      const files: any = req.files
      const formData = new FormData()
      files?.length &&
        files?.forEach((f: Express.Multer.File) => {
          formData.append("images", f.buffer, {
            filename: f.originalname,
            contentType: f.mimetype,
          })
        })
      const response = await axios.post(
        process.env.MEDIA_SERVICE_URI as string,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      )
      const newPost = await PostModel.create({
        owner: _id,
        title,
        content,
        // images: response.data ? response.data : [],
      })
      res.status(201).json({ Status: "Success", Post: newPost })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
