import { Schema, model, Types, SchemaTypes, Model } from "mongoose"

interface refreshTokenSchemaType extends Document {
  idUtilisateur: Types.ObjectId
  refreshToken: string
}
interface refreshTokenStatics extends Model<refreshTokenSchemaType> {
  refreshExists: (refresh: string) => Promise<boolean>
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
//Verify if refreshtoken exist
RefreshTokenSchema.statics.refreshExists = async function (refresh: string) {
  return !!(await this.findOne({ refreshToken: refresh.toString() }))
}

const RefreshTokenModel = model<refreshTokenSchemaType, refreshTokenStatics>(
  "refreshToken",
  RefreshTokenSchema
)
export default RefreshTokenModel
