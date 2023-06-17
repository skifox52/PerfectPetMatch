import { Schema, model } from "mongoose";
//--Comment Schema
const CommentSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    content: {
        type: String,
        required: true,
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    replyCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
export const CommentModel = model("Comment", CommentSchema);
