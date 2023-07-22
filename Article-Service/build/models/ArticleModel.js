import { Schema, model } from "mongoose";
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const ArticleModel = model("Article", ArticleSchema);
