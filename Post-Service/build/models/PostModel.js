import { Schema, model } from "mongoose";
const animalTypes = Object.freeze(["Chat", "Chien"]);
//Schemas
//--pet schema
const petSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: animalTypes,
    },
    race: {
        type: String,
        required: true,
    },
    date_de_naissance: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });
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
        required: true,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
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
export const CommentModel = model("Comment", CommentSchema);
export const PetModel = model("Pet", petSchema);
export const PostModel = model("Post", PostSchema);
