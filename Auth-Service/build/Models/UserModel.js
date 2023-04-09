import { Schema, model } from "mongoose";
//User Schema
const UserSchema = new Schema({
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
                (1000 * 60 * 60 * 24 * 30 * 12));
        },
    },
    role: {
        type: String,
        default: "user",
        lowercase: true,
        enum: ["user", "admin"],
    },
    picture: {
        type: String,
        default: function () {
            if (this.sexe === "homme") {
                return "/assets/man.png";
            }
            else {
                return "/assets/woman.png";
            }
        },
        googleID: {
            type: String,
            unique: true,
        },
    },
}, { timestamps: true });
const UserModel = model("User", UserSchema);
export default UserModel;
