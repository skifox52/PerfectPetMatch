import { Schema, model } from "mongoose";
const animalTypes = Object.freeze(["Chat", "Chien"]);
//--pet schema
const petSchema = new Schema({
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
}, { timestamps: true });
export const PetModel = model("Pet", petSchema);
