import { Schema, Types, model, Document } from "mongoose"

//Types
//--Comment Type
export interface CommentInterface extends Document {
  userId: Types.ObjectId
  postId: Types.ObjectId
  content: string
  parentComment: Types.ObjectId
}
//--Post Type
export interface PostInterface extends Document {
  owner: String
  pets: Types.ObjectId
  comments: Types.ObjectId[]
  title: string
  content: string
  images: string[]
  pet: Types.ObjectId
  likes: number
  reports: number
}
//--Pet type
export interface petInterface extends Document {
  type: "Chat" | "Chien"
  race: string
  date_de_naissance: Date
  description: string
}
const animalTypes = Object.freeze(["Chat", "Chien"])
//Schemas
//--pet schema
const petSchema = new Schema<petInterface>(
  {
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
  },
  { timestamps: true }
)
//--Comment Schema
const CommentSchema = new Schema<CommentInterface>(
  {
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
  },
  { timestamps: true }
)
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
  },
  { timestamps: true }
)
export const CommentModel = model<CommentInterface>("Comment", CommentSchema)
export const PetModel = model<petInterface>("Pet", petSchema)
export const PostModel = model<PostInterface>("Post", PostSchema)
