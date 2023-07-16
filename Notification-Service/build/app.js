import express from "express";
import "dotenv/config";
import { Redis } from "ioredis";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import compression from "compression";
const app = express();
//Redis client/subscriber initialization
const redisSubscriber = new Redis();
const redisClient = new Redis();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(compression());
app.use(morgan("dev"));
//WebSocket Server
const server = createServer(app);
const wss = new WebSocketServer({ server });
wss.on("connection", (socket) => {
    console.log(`Client connected`);
    socket.addEventListener("message", (data) => {
        console.log(data);
    });
    socket.addEventListener("error", (ev) => console.log(ev));
    socket.addEventListener("close", () => {
        console.log("Client disconnected");
    });
});
(() => {
    redisSubscriber.subscribe("notification", (err) => {
        if (err) {
            console.log(err);
        }
        else {
            redisSubscriber.on("message", async (_, message) => {
                const response = await fetch(`${process.env.API_GATEWAY}/api/user/one?_id=${message.split("-")[3]}`);
                const { nom, prenom, image, googleID } = await response.json();
                const hashedMessage = JSON.stringify({
                    type: message.split("-")[1],
                    post: message.split("-")[2],
                    owner: message.split("-")[0],
                    user: {
                        nom,
                        prenom,
                        image,
                        googleID,
                    },
                    comment: message.split("-")[4] || null,
                    timeStamps: Date.now(),
                    isSeen: false,
                });
                await redisClient.zadd(message.split("-")[0], Date.now(), hashedMessage);
                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN) {
                        client.send(hashedMessage);
                    }
                });
            });
        }
    });
})();
//Fetch notifications
app.get("/api/notifications", async (req, res) => {
    try {
        const { _id } = req.headers["x-auth-user"] &&
            JSON.parse(req.headers["x-auth-user"]);
        const notifications = await redisClient.zrevrange(_id, 0, -1);
        const parsedNotifications = notifications
            .map((not) => JSON.parse(not))
            .sort((a, b) => b.timeStamps - a.timeStamps);
        res.status(200).json(parsedNotifications);
    }
    catch (error) {
        res.status(400).json(error.message);
    }
});
//Mark as seen
app.put("/api/notifications", async (req, res) => {
    try {
        const { _id } = req.headers["x-auth-user"] &&
            JSON.parse(req.headers["x-auth-user"]);
        const notifications = (await redisClient.zrevrange(_id, 0, -1)).map((not) => {
            const parsedNotification = JSON.parse(not);
            parsedNotification.isSeen === false
                ? (parsedNotification.isSeen = true)
                : parsedNotification.isSeen;
            return parsedNotification;
        });
        await redisClient.zremrangebyrank(_id, 0, -1);
        for (const updatedNotification of notifications) {
            await redisClient.zadd(_id, Date.now(), JSON.stringify(updatedNotification));
        }
        res
            .status(202)
            .json({ success: true, message: "Notifications have been seen!" });
    }
    catch (error) {
        res.status(400).json(error.message);
    }
});
//Delete old notifications
server.listen(process.env.PORT, () => console.log(`Notification service running on port ${process.env.PORT}`));
