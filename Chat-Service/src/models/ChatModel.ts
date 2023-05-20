import { Schema, model, Types, Model, Document } from "mongoose"

//Schema types
export interface ConversationInterface extends Document {
  users: Types.ObjectId[]
}
export interface ConversationModelInterface
  extends Model<ConversationInterface> {
  conversationExist: ([patient_one, patient_two]: [
    Types.ObjectId,
    Types.ObjectId
  ]) => Promise<ConversationInterface | null>
}
export interface MessageInterface extends Document {
  conversation: Types.ObjectId
  sender: Types.ObjectId
  content: string
}

//Schemas
const conversationSchema = new Schema<ConversationInterface>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
)

const messageSchema = new Schema<MessageInterface>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

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
