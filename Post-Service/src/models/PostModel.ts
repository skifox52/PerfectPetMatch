import { Schema, Types, model, Document } from "mongoose"

//Types
//--Pet type
interface petType {
  type: string
  race: string
  sexe: "male" | "femelle"
  date_de_naissance: Date
}
//--Post Type
export interface PostInterface extends Document {
  owner: String
  comments: Types.ObjectId[]
  category: "adoption" | "accouplement"
  description: string
  images: string[]
  pet: petType
  likes: string[]
  reports: number
}
//Schemas
const sexe = ["male", "femelle"] as const
const category = ["adoption", "accouplement"] as const
//Pet Schema
const PetSchema = new Schema<petType>({
  type: String,
  race: String,
  sexe: {
    type: String,
    enum: sexe,
  },
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
    category: {
      type: String,
      enum: category,
      required: true,
    },
    description: {
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
