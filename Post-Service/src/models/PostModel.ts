import {
  Schema,
  Types,
  model,
  Document,
  StringExpressionOperatorReturningArray,
} from "mongoose"

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
  owner: Types.ObjectId
  title: string
  content: string
  images: string[]
  likes: number
}

//Schemas
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
  },
  { timestamps: true }
)
export const CommentModel = model<CommentInterface>("Comment", CommentSchema)
export const PostModel = model<PostInterface>("Post", PostSchema)
