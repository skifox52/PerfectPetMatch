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
            if (this.sexe) {
                if (this.sexe === "homme") {
                    return "/assets/profilePictures/defaultman.png";
                }
                else {
                    return "/assets/profilePictures/defaultwoman.png";
                }
            }
            else {
                return "";
            }
        },
    },
    googleID: {
        type: String,
    },
    resetKey: {
        type: String,
    },
}, { timestamps: true });
//Static method to see if User exists
UserSchema.statics.userExists = async function (mail) {
    return !!(await this.findOne({ mail }));
};
//Static method to see if resetKeyExist
UserSchema.statics.keyExists = async function (mail) {
    const user = await this.findOne({ mail });
    return user.resetKey;
};
const UserModel = model("User", UserSchema);
export default UserModel;
