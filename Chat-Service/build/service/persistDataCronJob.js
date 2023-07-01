import cron from "node-cron";
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
                ;
                (await redisClient.lrange(mes, 0, -1)).forEach(async (msg, i) => {
                    const message = JSON.parse(msg);
                    await MessageModel.create({
                        conversation: message.conversationId,
                        sender: message.sender,
                        content: message.content,
                        timeStamps: message.timeStamps,
                    });
                });
            });
            await redisClient.del(messages);
        }
        else {
            return;
        }
    }
    catch (error) {
        throw new Error(error);
    }
};
//Use node-cron to execute this function
cron.schedule("* * * * *", () => {
    console.log("CRON EXECUTED");
    persistMessages();
});
