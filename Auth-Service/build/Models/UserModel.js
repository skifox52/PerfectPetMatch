import { Schema, model } from "mongoose";
//User Schema
const UserSchema = new Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    mot_de_passe: {
        type: String,
        required: true,
    },
    sexe: {
        type: String,
        enum: ["Homme", "Femme"],
        required: true,
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
});
const UserModel = model("User", UserSchema);
module.exports = UserModel;
