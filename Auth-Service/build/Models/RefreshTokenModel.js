import { Schema, model, SchemaTypes } from "mongoose";
const RefreshTokenSchema = new Schema({
    idUtilisateur: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const RefreshTokenModel = model("refreshToken", RefreshTokenSchema);
export default RefreshTokenModel;
