import { Redis } from "ioredis";
import { MessageModel } from "../models/ChatModel.js";
//Create a redis cleint that par default uses `http://localhost:6379`
//Function that persist message from redis to mongoDB and delete them from redis after persistance
const redisClient = new Redis();
export const persistMessages = async () => {
    try {
        const messages = await redisClient.keys("chat-conversation:*");
        if (messages.length > 0) {
            messages.forEach(async (mes) => {
                const list = await redisClient.lrange(mes, 0, -11);
                if (list.length === 0)
                    return;
                list.forEach(async (msg) => {
                    const message = JSON.parse(msg);
                    await MessageModel.create({
                        conversation: message.conversationId,
                        sender: message.sender,
                        content: message.content,
                        timeStamps: message.timeStamps,
                    });
                });
            });
            //Delete persisted messages from redis
            messages.forEach(async (mes) => {
                redisClient.ltrim(mes, -10, -1);
            });
        }
        else {
            return;
        }
    }
    catch (error) {
        throw new Error(error);
    }
};
