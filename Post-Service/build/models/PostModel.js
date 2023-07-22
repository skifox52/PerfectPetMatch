import { Schema, model } from "mongoose";
import "dotenv/config";
//Schemas
const sexe = ["male", "femelle"];
const category = ["adoption", "accouplement"];
const reports = [
    "Signalement pour une publication inappropriée",
    "Signalement pour un comportement abusif dans les commentaires",
    "Signalement pour un faux compte ou une arnaque",
    "Signalement pour une annonce suspecte",
];
//Pet Schema
const PetSchema = new Schema({
    type: String,
    race: String,
    sexe: {
        type: String,
        enum: sexe,
    },
    date_de_naissance: Date,
});
//--Post Schema
const PostSchema = new Schema({
    owner: {
        type: String,
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
    wilaya: { type: String },
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
}, { timestamps: true });
PostSchema.pre("save", async function (next) {
    try {
        const response = await fetch(`${process.env.API_GATEWAY}/api/user/one?_id=${this.owner}`);
        if (!response.ok)
            throw new Error(`Failed to fetch user data. Status: ${response.status}`);
        const { ville } = await response.json();
        this.wilaya = ville;
        next();
    }
    catch (error) {
        console.error("Error in post pre-save hook:", error);
        next(error);
    }
});
export const PostModel = model("Post", PostSchema);
