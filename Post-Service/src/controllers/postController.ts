import expressAsyncHandler from "express-async-handler"
import { Request, Response, response } from "express"
import { PostModel } from "../models/PostModel.js"
import { CommentModel } from "../models/CommentModel.js"
import FormData from "form-data"
import axios from "axios"
import "dotenv/config"

//Get all posts
export const getAllPosts = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const allPosts = await PostModel.find()
      .populate("pet")
      .sort({ createdAt: -1 })
    //Get the id of all users
    const usersId = allPosts.map((post) => post.owner)
    const filteredUsersId = usersId.filter((id, i, usersId) => {
      return usersId.indexOf(id) === i
    })
    const response = await axios.post<any[]>(
      "http://localhost:3333/api/user/getUsersByIds",
      { ids: filteredUsersId.length ? filteredUsersId : [] }
    )
    const populatedPosts = allPosts.map((post) => {
      const { owner, ...restData } = post.toObject()
      return {
        ...restData,
        owner: response.data.filter(
          (user) => user._id.toString() === post.owner.toString()
        )[0],
      }
    })
    res.status(200).json(populatedPosts)
  }
)

//Post a post
export const postPost = expressAsyncHandler(
  async (req: any, res: Response): Promise<void> => {
    const { _id } =
      req.headers["x-auth-user"] && JSON.parse(req.headers["x-auth-user"])
    const { category, description, type, race, date_de_naissance, sexe } =
      req.body
    if (
      !category ||
      !description ||
      !type ||
      !race ||
      !date_de_naissance ||
      !sexe
    ) {
      res.status(400)
      throw new Error("Empty fields!")
    }
    let responseData
    if (req.files.length) {
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
      responseData = response.data
    }
    const newPost = await PostModel.create({
      owner: _id,
      category,
      description,
      pet: { type, race, date_de_naissance, sexe },
      images: responseData ? responseData : [],
    })
    res.status(201).json({ Status: "Success", Post: newPost })
  }
)
//Update a post
export const updatePost = expressAsyncHandler(
  async (req: Request<{ postId: string }>, res: Response) => {
    const { postId } = req.params
    const { title, content } = req.body
    if (!title && !content)
      throw new Error("Empty fields, there is nothing to update!")
    await PostModel.findByIdAndUpdate(postId, {
      content: content,
      title: title,
    })
    res
      .status(200)
      .json({ success: true, message: "post updated successfully!" })
  }
)
//Delete post
export const deletePost = expressAsyncHandler(
  async (req: Request<{ postId: string }>, res: Response) => {
    const { postId } = req.params
    const deletedPost = await PostModel.findByIdAndDelete(postId)
    if (deletedPost?.comments.length! > 0) {
      deletedPost?.comments.forEach(async (com) => {
        await CommentModel.findByIdAndDelete(com)
      })
    }
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" })
  }
)
//Comment section
//Post a comment
export const postComment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { postId, content } = req.body
    const { _id } = JSON.parse(req.headers["x-auth-user"]!.toString())
    if (!postId || !content) throw new Error("Empty fields!")
    const newComment = await CommentModel.create({
      userId: _id,
      content,
      postId,
    })
    await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    })
    res.status(200).json(newComment)
  }
)
//Reply to a comment
export const comentReply = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { comentId, content } = req.body
    const currentUser = JSON.parse(req.headers["x-auth-user"] as string)
    await CommentModel.findByIdAndUpdate(comentId, {
      $inc: { replyCount: 1 },
    })
    if (!comentId || !content) throw new Error("Empty fields")
    const reply = await CommentModel.create({
      parentComment: comentId,
      userId: currentUser._id,
      content,
    })
    res.status(200).json(reply)
  }
)
//Find all coments
export const findAllComments = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const comments = await CommentModel.find({
      parentComment: { $exists: false },
    })
    res.status(200).json(comments)
  }
)
//Get reply
export const getReplyComment = expressAsyncHandler(
  async (
    req: Request<{}, {}, { commentId: string }>,
    res: Response
  ): Promise<void> => {
    const { commentId } = req.query
    if (!commentId) {
      res.status(400)
      throw new Error("No coment specified!")
    }
    const replies = await CommentModel.find({ parentComment: commentId })
    res.status(200).json(replies)
  }
)
//Update a comment
export const updateComment = expressAsyncHandler(
  async (req: Request<{ commentId: string }>, res: Response): Promise<void> => {
    const { commentId } = req.params
    const { content } = req.body
    if (!content) throw new Error("Empty fields!")
    await CommentModel.findByIdAndUpdate(commentId, { content })
    res
      .status(200)
      .json({ success: true, message: "Comment updated successfully!" })
  }
)
//Delete a comment
export const deleteComment = expressAsyncHandler(
  async (req: Request<{ commentId: string }>, res: Response): Promise<void> => {
    const { commentId } = req.params
    const deletedComment = await CommentModel.findByIdAndDelete(commentId)
    if (deletedComment?.parentComment) {
      await CommentModel.findByIdAndUpdate(deletedComment.parentComment, {
        $inc: { replyCount: -1 },
      })
    } else {
      await PostModel.findByIdAndUpdate(deletedComment?.postId, {
        $pull: { comments: commentId },
      })
    }

    if (deletedComment?.replyCount! > 0) {
      await CommentModel.deleteMany({ parentComment: commentId })
    }
    res.status(200).json({
      success: true,
      message: "Comment deleted successfylly!",
    })
  }
)
//Like section
//Like a post
export const likePost = expressAsyncHandler(
  async (req: Request<{}, {}, { postId: string }>, res: Response) => {
    const { _id } = JSON.parse(req.headers["x-auth-user"] as string)
    await PostModel.findByIdAndUpdate(req.query.postId, {
      $push: { likes: _id },
    })
    res.status(200).json({ success: true, message: "Post liked successfully!" })
  }
)
//Remove a like
export const dislikePost = expressAsyncHandler(
  async (req: Request<{}, {}, { postId: string }>, res: Response) => {
    await PostModel.findByIdAndUpdate(req.query.postId, { $inc: { likes: -1 } })
    res
      .status(200)
      .json({ success: true, message: "Post disliked successfully!" })
  }
)
//Report section
//Report a post
export const reportPost = expressAsyncHandler(
  async (req: Request<{}, {}, { postId: string }>, res: Response) => {
    await PostModel.findByIdAndUpdate(req.query.postId, {
      $inc: { reports: 1 },
    })
    res
      .status(200)
      .json({ success: true, message: "Post reported successfully!" })
  }
)
//Remove report from a post
export const removePortReport = expressAsyncHandler(
  async (req: Request<{}, {}, { postId: string }>, res: Response) => {
    await PostModel.findByIdAndUpdate(req.query.postId, {
      $inc: { reports: -1 },
    })
    res.status(200).json({
      success: true,
      message: "Report removed from the post successfully!",
    })
  }
)
//Utilities
//Delete post and comments if user is deleted
export const afterUserDelete = expressAsyncHandler(
  async (
    req: Request<{}, {}, { userId: string }>,
    res: Response
  ): Promise<void> => {
    const userId = req.query
    const posts = await PostModel.find({ owner: userId })
    posts.forEach(async (post) => {
      post.comments.forEach(
        async (com) => await CommentModel.findByIdAndDelete(com)
      )
      await PostModel.findByIdAndDelete(post._id)
    })
    res.json({
      success: true,
      message: "User posts and comments deleted successfulyy",
    })
  }
)
