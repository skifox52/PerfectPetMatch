import { Schema, model } from "mongoose";
//Schemas
//Pet Schema
const PetSchema = new Schema({
    type: String,
    race: String,
    date_de_naissance: Date,
});
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
        type: PetSchema,
        required: true,
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
    likes: [
        {
            type: String,
        },
    ],
    reports: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
export const PostModel = model("Post", PostSchema);
