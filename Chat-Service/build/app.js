import express from "express";
import http from "node:http";
import { connect, Types } from "mongoose";
import { Server as WebSocketServer } from "socket.io";
import morgan from "morgan";
import "dotenv/config";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import expressAsyncHandler from "express-async-handler";
import compression from "compression";
import { ConversationModel, MessageModel } from "./models/ChatModel.js";
const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});
app.use(morgan("dev"));
app.use(compression());
// app.use(cors())
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
        res.status(200).json({ message: "Message sent successfully!" });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//API for getting conversation history
app.get("/api/chat/messages/:conversationId", expressAsyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await MessageModel.find({
            conversation: conversationId,
        });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(400);
        throw new error(error);
    }
}));
//Websockets connections handeling
io.on("connection", (socket) => {
    console.log("New connection", socket.id);
    //Handeling joining conversation
    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
    });
    //Handeling incoming chat messages from the client
    socket.on("sendMessage", async (data) => {
        const { conversationId, senderId, content } = data;
        try {
            //Save message to database
            const newMessage = await MessageModel.create({
                conversation: conversationId,
                sender: senderId,
                content: content,
            });
            //Emit the message to the participent of the conversation
            io.to(conversationId).emit("newMessage", newMessage);
        }
        catch (error) {
            console.error(error);
            throw new Error(error);
        }
    });
    //Handeling disconnection
    socket.on("disconnected", () => {
        console.log("Disconnected: ", socket.id);
    });
});
//Error Handler
app.use(ErrorHandler);
connect(process.env.MONGO_URI)
    .then(() => {
    server.listen(process.env.PORT, () => console.log(`Chat service running at port ${process.env.PORT}`));
})
    .catch((err) => {
    console.log(err);
});
