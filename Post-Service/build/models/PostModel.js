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
        type: Schema.Types.ObjectId,
        ref: "Pet",
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
export const CommentModel = model("Comment", CommentSchema);
export const PetModel = model("Pet", petSchema);
export const PostModel = model("Post", PostSchema);
