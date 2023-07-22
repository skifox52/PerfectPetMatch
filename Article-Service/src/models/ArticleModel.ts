import { Schema, model } from "mongoose"

export interface ArticleInterface extends Document {
  title: string
  content: string
  image: string
  source: string
}

const ArticleSchema = new Schema<ArticleInterface>(
  {
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
  },
  { timestamps: true }
)

export const ArticleModel = model<ArticleInterface>("Article", ArticleSchema)
