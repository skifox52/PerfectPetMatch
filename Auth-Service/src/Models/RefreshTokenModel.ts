import { Schema, model, Types, SchemaTypes } from "mongoose"

interface refreshTokenSchemaType {
  idUtilisateur: Types.ObjectId
  refreshToken: string
}

const RefreshTokenSchema = new Schema<refreshTokenSchemaType>(
  {
    idUtilisateur: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const RefreshTokenModel = model("refreshToken", RefreshTokenSchema)
export default RefreshTokenModel
