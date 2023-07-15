import { Redis } from "ioredis";
import WebSocket from "ws";
//Redis client initialization
const redisClient = new Redis();
//WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (socket) => {
    console.log(`Client connected`);
    socket.on("message", (data) => {
        console.log(data);
    });
    socket.on("error", (err) => {
        console.error(err.message);
    });
    socket.on("close", () => {
        console.log("Client disconnected");
    });
});
//Notification listener
export const startNotificationService = () => {
    const channels = ["like-*", "comment-*", "message-*"];
    redisClient.psubscribe(...channels, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            redisClient.on("pmessage", (pattern, channel, message) => {
                const [type, user, id] = channel.split("-");
                console.log("Norification Type: ", type);
                console.log("Norification User: ", user);
                console.log("Norification Id: ", id);
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            });
        }
    });
};
