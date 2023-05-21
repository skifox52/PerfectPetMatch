import { Schema, model, } from "mongoose";
//Schemas
//--Comment Schema
const CommentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        required: false,
    },
}, { timestamps: true });
//--Post Schema
const PostSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: false,
    },
    likes: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
export const CommentModel = model("Comment", CommentSchema);
export const PostModel = model("Post", PostSchema);
