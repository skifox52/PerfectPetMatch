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
                    (1000 * 60 * 60 * 24 * 30 * 12));
            }
            else {
                return 0;
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
                return "/assets/profilePictures/defaultman.png";
            }
            else {
                return "/assets/profilePicture/defaultwoman.png";
            }
        },
        googleID: {
            type: String,
            unique: true,
        },
    },
}, { timestamps: true });
UserSchema.statics.userExists = async function (mail) {
    return (await this.findOne({ mail })) !== null;
};
const UserModel = model("User", UserSchema);
export default UserModel;
