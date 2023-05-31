import { Schema, model, Model, Document } from "mongoose"

//User type
export interface UserType extends Document {
  nom: string
  prenom: string
  mail: string
  mot_de_passe: string
  sexe: "homme" | "femme"
  adresse: string
  date_de_naissance: Date
  age: number
  role?: "user" | "admin"
  image: string
  ville: string
  googleID?: string
  resetKey?: string
}
export interface UserTypeModel extends Model<UserType> {
  userExists: (mail: string) => Promise<boolean>
  keyExists: (mail: string) => Promise<string>
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
    },
    sexe: {
      type: String,
      enum: ["homme", "femme"],
      lowercase: true,
    },
    adresse: {
      type: String,
    },
    date_de_naissance: {
      type: Date,
    },
    age: {
      type: Number,
      default: function () {
        if (this.date_de_naissance) {
          return Math.floor(
            // @ts-ignore
            (new Date() - new Date(this.date_de_naissance)) /
              (1000 * 60 * 60 * 24 * 30 * 12)
          )
        } else {
          return 0
        }
      },
    },
    ville: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      lowercase: true,
      enum: ["user", "admin"],
    },
    image: {
      type: String,
      default: function () {
        if (this.sexe === "homme") {
          return "/assets/profilePictures/defaultman.png"
        } else {
          return "/assets/profilePicture/defaultwoman.png"
        }
      },
    },
    googleID: {
      type: String,
      unique: true,
    },
    resetKey: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
)

//Static method to see if User exists
UserSchema.statics.userExists = async function (
  mail: string
): Promise<boolean> {
  return (await this.findOne({ mail })) !== null
}
//Static method to see if resetKeyExist
UserSchema.statics.keyExists = async function (mail: string): Promise<string> {
  const user = await this.findOne({ mail })
  return user.resetKey
}
const UserModel = model<UserType, UserTypeModel>("User", UserSchema)
export default UserModel
