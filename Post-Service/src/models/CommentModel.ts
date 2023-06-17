import { Schema, model, Types } from "mongoose"
//--Comment Type
export interface CommentInterface extends Document {
  userId: string
  postId: Types.ObjectId
  content: string
  parentComment?: Types.ObjectId
  replyCount: number
}
//--Comment Schema
const CommentSchema = new Schema<CommentInterface>(
  {
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
  },
  { timestamps: true }
)
export const CommentModel = model<CommentInterface>("Comment", CommentSchema)
