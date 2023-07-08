import { Schema, Types, model, Document } from "mongoose"

//Types
//--Pet type
interface petType {
  type: string
  race: string
  date_de_naissance: Date
}
//--Post Type
export interface PostInterface extends Document {
  owner: String
  comments: Types.ObjectId[]
  title: string
  content: string
  images: string[]
  pet: petType
  likes: string[]
  reports: number
}

//Schemas
//Pet Schema
const PetSchema = new Schema<petType>({
  type: String,
  race: String,
  date_de_naissance: Date,
})
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
  },
  { timestamps: true }
)
export const PostModel = model<PostInterface>("Post", PostSchema)
