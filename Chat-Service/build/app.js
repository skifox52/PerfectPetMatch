import express from "express";
import http from "node:http";
import { connect, Types } from "mongoose";
import { Server as WebSocketServer } from "socket.io";
import morgan from "morgan";
import "dotenv/config";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import expressAsyncHandler from "express-async-handler";
import { ConversationModel, MessageModel } from "./models/ChatModel.js";
const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server);
app.use(morgan("dev"));
//API for opening a conversation
app.post("/api/chat/conversation", expressAsyncHandler(async (req, res) => {
    const { user1, user2 } = req.body;
    try {
        const conversationExist = await ConversationModel.conversationExist([user1, user2]);
        let conversationId;
        if (conversationExist) {
            conversationId = conversationExist._id;
        }
        else {
            const newConversation = await ConversationModel.create({
                users: [new Types.ObjectId(user1), new Types.ObjectId(user2)],
            });
            conversationId = newConversation._id;
        }
        res.status(200).json({ conversationId: conversationId });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//API for sendig message
app.post("/api/chat/message", expressAsyncHandler(async (req, res) => {
    const { conversationId, sender, message } = req.body;
    try {
        const newMessage = await MessageModel.create({
            conversation: new Types.ObjectId(conversationId),
            sender: new Types.ObjectId(sender),
            content: message,
        });
        //Emit the messgage to the participant of the conversation
        io.to(conversationId).emit("newMessage", newMessage);
        res.status(200).json("Message sent successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Error Handler
app.use(ErrorHandler);
connect(process.env.MONGO_URI)
    .then(() => {
    server.listen(process.env.PORT, () => console.log("Chat service running"));
})
    .catch((err) => {
    console.log(err);
});
