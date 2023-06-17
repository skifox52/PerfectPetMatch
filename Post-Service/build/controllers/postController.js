import expressAsyncHandler from "express-async-handler";
import { CommentModel, PostModel } from "../models/PostModel.js";
import FormData from "form-data";
import axios from "axios";
import "dotenv/config";
//Get all posts
export const getAllPosts = expressAsyncHandler(async (req, res) => {
    const allPosts = await PostModel.find();
    //Get the id of all users
    const usersId = allPosts.map((post) => post.owner);
    const filteredUsersId = usersId.filter((id, i, usersId) => {
        return usersId.indexOf(id) === i;
    });
    const response = await axios.post("http://localhost:3333/api/user/getUsersByIds", { ids: filteredUsersId.length ? filteredUsersId : [] });
    const populatedPosts = allPosts.map((post) => {
        const { owner, ...restData } = post.toObject();
        return {
            ...restData,
            owner: response.data.filter((user) => user._id.toString() === post.owner.toString())[0],
        };
    });
    res.status(200).json(populatedPosts);
});
//Post a post
export const postPost = expressAsyncHandler(async (req, res) => {
    const { _id } = req.headers["x-auth-user"] && JSON.parse(req.headers["x-auth-user"]);
    const { title, content } = req.body;
    if (!title || !content) {
        res.status(400);
        throw new Error("Empty fields!");
    }
    const files = req.files;
    const formData = new FormData();
    files?.length &&
        files?.forEach((f) => {
            formData.append("images", f.buffer, {
                filename: f.originalname,
                contentType: f.mimetype,
            });
        });
    const response = await axios.post(process.env.MEDIA_SERVICE_URI, formData, {
        headers: {
            ...formData.getHeaders(),
        },
    });
    const newPost = await PostModel.create({
        owner: _id,
        title,
        content,
        images: response.data ? response.data : [],
    });
    res.status(201).json({ Status: "Success", Post: newPost });
});
//Update a post
export const updatePost = expressAsyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    if (!title && !content)
        throw new Error("Empty fields, there is nothing to update!");
    await PostModel.findByIdAndUpdate(postId, {
        content: content,
        title: title,
    });
    res
        .status(200)
        .json({ success: true, message: "post updated successfully!" });
});
//Delete post
export const deletePost = expressAsyncHandler(async (req, res) => {
    const { postId } = req.params;
    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (deletedPost?.comments.length > 0) {
        deletedPost?.comments.forEach(async (com) => {
            await CommentModel.findByIdAndDelete(com);
        });
    }
    res
        .status(200)
        .json({ success: true, message: "Post deleted successfully" });
});
//Comment section
//Post a comment
export const postComment = expressAsyncHandler(async (req, res) => {
    const { postId, content } = req.body;
    const { _id } = JSON.parse(req.headers["x-auth-user"].toString());
    if (!postId || !content)
        throw new Error("Empty fields!");
    const newComment = await CommentModel.create({
        userId: _id,
        content,
        postId,
    });
    await PostModel.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
    });
    res.status(200).json(newComment);
});
//Reply to a comment
export const comentReply = expressAsyncHandler(async (req, res) => {
    const { comentId, content } = req.body;
    const currentUser = JSON.parse(req.headers["x-auth-user"]);
    await CommentModel.findByIdAndUpdate(comentId, {
        $inc: { replyCount: 1 },
    });
    if (!comentId || !content)
        throw new Error("Empty fields");
    const reply = await CommentModel.create({
        parentComment: comentId,
        userId: currentUser._id,
        content,
    });
    res.status(200).json(reply);
});
//Find all coments
export const findAllComments = expressAsyncHandler(async (req, res) => {
    const comments = await CommentModel.find({
        parentComment: { $exists: false },
    });
    res.status(200).json(comments);
});
//Get reply
export const getReplyComment = expressAsyncHandler(async (req, res) => {
    const { commentId } = req.query;
    if (!commentId) {
        res.status(400);
        throw new Error("No coment specified!");
    }
    const replies = await CommentModel.find({ parentComment: commentId });
    res.status(200).json(replies);
});
//Update a comment
export const updateComment = expressAsyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    if (!content)
        throw new Error("Empty fields!");
    await CommentModel.findByIdAndUpdate(commentId, { content });
    res
        .status(200)
        .json({ success: true, message: "Comment updated successfully!" });
});
//Delete a comment
export const deleteComment = expressAsyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);
    if (deletedComment?.parentComment) {
        await CommentModel.findByIdAndUpdate(deletedComment.parentComment, {
            $inc: { replyCount: -1 },
        });
    }
    else {
        await PostModel.findByIdAndUpdate(deletedComment?.postId, {
            $pull: { comments: commentId },
        });
    }
    if (deletedComment?.replyCount > 0) {
        await CommentModel.deleteMany({ parentComment: commentId });
    }
    res.status(200).json({
        success: true,
        message: "Comment deleted successfylly!",
    });
});
//Like section
//Like a post
export const likePost = expressAsyncHandler(async (req, res) => {
    await PostModel.findByIdAndUpdate(req.query.postId, { $inc: { likes: 1 } });
    res.status(200).json({ success: true, message: "Post liked successfully!" });
});
//Remove a like
export const dislikePost = expressAsyncHandler(async (req, res) => {
    await PostModel.findByIdAndUpdate(req.query.postId, { $inc: { likes: -1 } });
    res
        .status(200)
        .json({ success: true, message: "Post disliked successfully!" });
});
//Report section
//Report a post
export const reportPost = expressAsyncHandler(async (req, res) => {
    await PostModel.findByIdAndUpdate(req.query.postId, {
        $inc: { reports: 1 },
    });
    res
        .status(200)
        .json({ success: true, message: "Post reported successfully!" });
});
//Remove report from a post
export const removePortReport = expressAsyncHandler(async (req, res) => {
    await PostModel.findByIdAndUpdate(req.query.postId, {
        $inc: { reports: -1 },
    });
    res.status(200).json({
        success: true,
        message: "Report removed from the post successfully!",
    });
});
//Utilities
//Delete post and comments if user is deleted
export const afterUserDelete = expressAsyncHandler(async (req, res) => {
    const userId = req.query;
    const posts = await PostModel.find({ owner: userId });
    posts.forEach(async (post) => {
        post.comments.forEach(async (com) => await CommentModel.findByIdAndDelete(com));
        await PostModel.findByIdAndDelete(post._id);
    });
    res.json({
        success: true,
        message: "User posts and comments deleted successfulyy",
    });
});
