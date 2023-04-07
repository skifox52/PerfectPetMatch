import { Schema, model } from "mongoose"

//User type
interface UserType {
  nom: string
  prenom: string
  mail: string
  mot_de_passe: string
  sexe: "homme" | "femme"
  adresse: string
  date_de_naissance: Date
  age: number
  role: "user" | "admin"
}
//User Schema
const UserSchema = new Schema<UserType>(
  {
    nom: {
      type: String,
      uppercase: true,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
      unique: true,
    },
    mot_de_passe: {
      type: String,
      required: true,
    },
    sexe: {
      type: String,
      enum: ["homme", "femme"],
      required: true,
      lowercase: true,
    },
    adresse: {
      type: String,
      required: true,
    },
    date_de_naissance: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      default: function () {
        return Math.floor(
          // @ts-ignore
          (new Date() - new Date(this.date_de_naissance)) /
            (1000 * 60 * 60 * 24 * 30 * 12)
        )
      },
    },
    role: {
      type: String,
      default: "user",
      lowercase: true,
      enum: ["user", "qdmin"],
    },
  },
  { timestamps: true }
)

const UserModel = model("User", UserSchema)
export default UserModel
