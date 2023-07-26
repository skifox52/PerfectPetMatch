import expressAsyncHandler from "express-async-handler"
import { Request, Response, response } from "express"
import { PostModel } from "../models/PostModel.js"
import { CommentModel } from "../models/CommentModel.js"
import FormData from "form-data"
import axios from "axios"
import { Redis } from "ioredis"
import "dotenv/config"

//Redis Publisher
const redisPublisher = new Redis()

//Get all posts
export const getAllPosts = expressAsyncHandler(
  async (
    req: Request<
      {},
      {},
      {},
      {
        page: number
        wilaya?: string
        age?: string
        type?: "chat" | "chien"
        race?: string
        category?: "accouplement" | "adoption"
      }
    >,
    res: Response
  ): Promise<void> => {
    const { page, wilaya, age, type, race, category } = req.query
    //add filter queries
    const filter: any = {}
    if (!!age) {
      const currentDateMin: Date = new Date()
      const currentDateMax: Date = new Date()
      const maxAge: Date = new Date(
        currentDateMin.setFullYear(currentDateMin.getFullYear() - parseInt(age))
      )
      const minAge: Date = new Date(
        currentDateMax.setFullYear(
          currentDateMax.getFullYear() - (parseInt(age) - 1)
        )
      )
      if (parseInt(age) === 6) {
        filter["pet.date_de_naissance"] = {
          $gte: new Date(maxAge.toISOString()),
        }
      } else {
        filter["pet.date_de_naissance"] = {
          $gte: new Date(maxAge.toISOString()),
          $lte: new Date(minAge.toISOString()),
        }
      }
    }

    !!wilaya && (filter["wilaya"] = wilaya)
    !!category && (filter["category"] = category)
    !!type && (filter["pet.type"] = type)
    !!race && (filter["pet.race"] = race)
    console.log(filter)
    //Limit per page
    const limit: number = 5
    const skip: number = (page - 1) * limit
    const totalPages: number = Math.ceil(
      (await PostModel.find(filter).countDocuments()) / limit
    )
    const allPosts = await PostModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("pet")
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
    res.status(200).json({ posts: populatedPosts, totalPages })
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
    const post = await PostModel.findById(postId)
    //Push notification
    await redisPublisher.publish(
      "notification",
      `${post?.owner}-comment-${postId}-${_id}`
    )
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
export interface UserInterface {
  _id: string
  nom: string
  prenom: string
  mail: string
  image: string
  googleID?: string
}
export const findAllComments = expressAsyncHandler(
  async (
    req: Request<{ idPost: string }, {}, {}, { page: number }>,
    res: Response
  ): Promise<void> => {
    const { page } = req.query
    const { idPost } = req.params
    const commentsPerPage: number = 4
    const totalComments = await CommentModel.find({
      parentComment: { $exists: false },
      postId: idPost,
    }).countDocuments()
    const totalPages: number = Math.ceil(totalComments / commentsPerPage)
    const skip: number = (page - 1) * commentsPerPage
    const comments = await CommentModel.find({
      parentComment: { $exists: false },
      postId: idPost,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(commentsPerPage)
    const ids: any[] = comments.map((com) => com.userId)
    const response = await axios.post<UserInterface[]>(
      `${process.env.USER_SERVICE_URI}/getUsersByIds`,
      { ids }
    )
    const users: UserInterface[] = response.data
    const populatedComments = comments.map((com) => ({
      ...com.toObject(),
      userId: { ...users.filter((u) => u._id === com.userId)[0] },
    }))
    res.status(200).json({
      pages: populatedComments,
      pageCount: totalPages,
    })
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
  async (req: Request<{}, {}, {}, { postId: string }>, res: Response) => {
    const { postId }: { postId: string } = req.query
    const { _id } = JSON.parse(req.headers["x-auth-user"] as string)
    await PostModel.findByIdAndUpdate(postId, {
      $push: { likes: _id },
    })
    const post = await PostModel.findById(postId)
    //Push notification
    await redisPublisher.publish(
      "notification",
      `${post?.owner}-like-${postId}-${_id}`
    )
    res.status(200).json({ success: true, message: "Post liked successfully!" })
  }
)
//Remove a like
export const dislikePost = expressAsyncHandler(
  async (req: Request<{}, {}, { postId: string }>, res: Response) => {
    const { _id } = JSON.parse(req.headers["x-auth-user"] as string)
    await PostModel.findByIdAndUpdate(req.query.postId, {
      $pull: { likes: _id },
    })
    res
      .status(200)
      .json({ success: true, message: "Post disliked successfully!" })
  }
)
//Report section
//Report a post
export const reportPost = expressAsyncHandler(
  async (
    req: Request<{}, {}, { reason: string }, { postId: string }>,
    res: Response
  ) => {
    const { reason } = req.body
    if (!reason) throw new Error("Please provide a reason for the report!")
    const { _id } =
      req.headers["x-auth-user"] &&
      JSON.parse(req.headers["x-auth-user"] as string)
    await PostModel.findByIdAndUpdate(req.query.postId, {
      $push: {
        reports: {
          reason,
          user: _id,
        },
      },
    })
    res
      .status(200)
      .json({ success: true, message: "Post reported successfully!" })
  }
)
//Remove report from a post
export const removePortReport = expressAsyncHandler(
  async (req: Request<{}, {}, {}, { postId: string }>, res: Response) => {
    await PostModel.findByIdAndUpdate(req.query.postId, {
      $set: { reports: [] },
    })
    res.status(200).json({
      success: true,
      message: "Reports removed from the post successfully!",
    })
  }
)
//Get all reported posts
export const getReportedPosts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json(await PostModel.find({ reports: { $ne: [] } }))
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
//Utilities
export const getPostById = expressAsyncHandler(
  async (
    req: Request<{}, {}, {}, { _id: string }>,
    res: Response
  ): Promise<void> => {
    const { _id } = req.query
    res.status(200).json(await PostModel.findById(_id))
  }
)
