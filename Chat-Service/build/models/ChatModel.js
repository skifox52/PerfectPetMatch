import { Schema, model } from "mongoose";
//Schemas
const conversationSchema = new Schema({
    users: [
        {
            type: String,
            required: true,
        },
    ],
}, { timestamps: true });
const messageSchema = new Schema({
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
});
conversationSchema.statics.conversationExist = async function ([participant_one, participant_two,]) {
    return this.findOne({ users: { $all: [participant_one, participant_two] } });
};
export const ConversationModel = model("Conversation", conversationSchema);
export const MessageModel = model("Message", messageSchema);
