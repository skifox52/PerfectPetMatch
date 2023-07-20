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
  owner: string
  comments: Types.ObjectId[]
  category: "adoption" | "accouplement"
  description: string
  images: string[]
  pet: petType
  likes: string[]
  reports: { reason: string; user: string }[]
}
//Schemas
const sexe = ["male", "femelle"] as const
const category = ["adoption", "accouplement"] as const
const reports = [
  "Signalement pour une publication inappropriée",
  "Signalement pour un comportement abusif dans les commentaires",
  "Signalement pour un faux compte ou une arnaque",
  "Signalement pour une annonce suspecte",
] as const
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
      type: String,
      required: true,
      unique: true,
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
    reports: [
      {
        reason: {
          type: String,
          enum: reports,
        },
        user: String,
      },
    ],
  },
  { timestamps: true }
)
export const PostModel = model<PostInterface>("Post", PostSchema)
