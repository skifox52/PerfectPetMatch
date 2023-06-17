import { Schema, model } from "mongoose"

//--Pet type
export interface petInterface extends Document {
  type: "Chat" | "Chien"
  race: string
  date_de_naissance: Date
  description: string
}
const animalTypes = Object.freeze(["Chat", "Chien"])

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

export const PetModel = model<petInterface>("Pet", petSchema)
