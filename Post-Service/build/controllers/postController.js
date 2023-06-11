import expressAsyncHandler from "express-async-handler";
import { PostModel } from "../models/PostModel.js";
import FormData from "form-data";
import axios from "axios";
import "dotenv/config";
//Get all posts
export const getAllPosts = expressAsyncHandler(async (req, res) => {
    try {
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
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Post a post
export const postPost = expressAsyncHandler(async (req, res) => {
    const { _id } = req.headers["x-auth-user"] && JSON.parse(req.headers["x-auth-user"]);
    try {
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
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
//Post a comment
export const postComment = expressAsyncHandler(async (req, res) => {
    try {
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
