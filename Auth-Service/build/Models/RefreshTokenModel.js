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
//Verify if refreshtoken exist
RefreshTokenSchema.statics.refreshExists = async function (refresh) {
    return !!(await this.findOne({ refreshToken: refresh.toString() }));
};
const RefreshTokenModel = model("refreshToken", RefreshTokenSchema);
export default RefreshTokenModel;
