import { Schema, Types, model, Document } from "mongoose"

//Types

//--Post Type
export interface PostInterface extends Document {
  owner: String
  comments: Types.ObjectId[]
  title: string
  content: string
  images: string[]
  pet: string
  likes: number
  reports: number
}

//Schemas

//--Post Schema
const PostSchema = new Schema<PostInterface>(
  {
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
  },
  { timestamps: true }
)
export const PostModel = model<PostInterface>("Post", PostSchema)
