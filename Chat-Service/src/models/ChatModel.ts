import { Schema, model, Types, Model, Document } from "mongoose"

//Schema types
export interface ConversationInterface extends Document {
  users: Types.ObjectId[]
}
export interface ConversationModelInterface
  extends Model<ConversationInterface> {
  conversationExist: ([patient_one, patient_two]: [
    string,
    string
  ]) => Promise<ConversationInterface | null>
}
export interface MessageInterface extends Document {
  conversation: Types.ObjectId
  sender: string
  content: string
  timeStamps: number
}

//Schemas
const conversationSchema = new Schema<ConversationInterface>(
  {
    users: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
)

const messageSchema = new Schema<MessageInterface>({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timeStamps: {
    type: Number,
    required: true,
  },
})

conversationSchema.statics.conversationExist = async function ([
  participant_one,
  participant_two,
]: [Types.ObjectId, Types.ObjectId]) {
  return this.findOne({ users: { $all: [participant_one, participant_two] } })
}

export const ConversationModel = model<
  ConversationInterface,
  ConversationModelInterface
>("Conversation", conversationSchema)
export const MessageModel = model<MessageInterface>("Message", messageSchema)
