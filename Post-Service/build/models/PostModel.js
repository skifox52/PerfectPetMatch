import { Schema, model } from "mongoose";
//Schemas
//--Post Schema
const PostSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    pet: {
        type: String,
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
    reports: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
export const PostModel = model("Post", PostSchema);
