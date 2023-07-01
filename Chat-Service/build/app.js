import express from "express";
import http from "node:http";
import { connect, Types } from "mongoose";
import { Server as WebSocketServer } from "socket.io";
import morgan from "morgan";
import "dotenv/config";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import expressAsyncHandler from "express-async-handler";
import compression from "compression";
import cors from "cors";
import { ConversationModel } from "./models/ChatModel.js";
import { Redis } from "ioredis";
import { persistMessages } from "./service/persistData.js";
import cron from "node-cron";
//Setting up the cron-job
cron.schedule("30 * * * *", () => {
    persistMessages();
});
//Setting up the redis client
const redisClient = new Redis();
//Express setup
const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(compression());
//API for opening a conversation
app.post("/api/chat/conversation", expressAsyncHandler(async (req, res) => {
    const { user1, user2 } = req.body;
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
}));
//API for getting user conversations
app.get("/api/chat/conversation", expressAsyncHandler(async (req, res) => {
    const { _id } = JSON.parse(req.headers["x-auth-user"]);
    const conversations = await ConversationModel.find({
        users: { $in: _id },
    }).select("_id users");
    const filteredConversations = conversations.map((con) => {
        return {
            convId: con._id,
            user: con.users.filter((u) => u.toString() !== _id).toString(),
        };
    });
    await Promise.all(filteredConversations.map(async (conv) => {
        const response = await fetch(`${process.env.API_GATEWAY}/api/user/one?_id=${conv.user}`);
        const jsonresponse = await response.json();
        conv.user = jsonresponse;
    }));
    res.status(200).json(filteredConversations);
}));
//API for getting conversation history
app.get("/api/chat/messages/:conversationId", expressAsyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const redisMessages = await redisClient.lrange(`chat-conversation:${conversationId}`, 0, -1);
    res.status(200).json(redisMessages);
}));
//Websockets connections handeling
io.on("connection", (socket) => {
    console.log("New connection", socket.id);
    //Handeling joining conversation
    socket.on("joinConversation", (conversationId) => {
        console.log("Joined conversation number ", conversationId);
        socket.join(conversationId);
    });
    //Handeling incoming chat messages from the client
    socket.on("sendMessage", async (data) => {
        const { conversationId, senderId, content } = data;
        try {
            const newMessage = {
                conversationId,
                sender: senderId,
                content: content,
                timeStamps: Date.now(),
            };
            //Emit the message to the participent of the conversation
            io.to(conversationId).emit("newMessage", newMessage);
            await redisClient.rpush(`chat-conversation:${conversationId}`, JSON.stringify(newMessage));
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
