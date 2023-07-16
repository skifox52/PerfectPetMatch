import express, { Express, Request, Response } from "express"
import "dotenv/config"
import { Redis } from "ioredis"
import { WebSocketServer } from "ws"
import { createServer } from "http"
import morgan from "morgan"
import cors from "cors"
import "dotenv/config"
import compression from "compression"
import { NotificationType } from "./types/notificationTypes.js"

const app: Express = express()
//Redis client/subscriber initialization
const redisSubscriber = new Redis()
const redisClient = new Redis()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: "http://localhost:5173" }))
app.use(compression())
app.use(morgan("dev"))
//WebSocket Server
const server = createServer(app)
const wss = new WebSocketServer({ server })

wss.on("connection", (socket: WebSocket) => {
  console.log(`Client connected`)

  socket.addEventListener("message", (data) => {
    console.log(data)
  })
  socket.addEventListener("error", (ev: Event) => console.log(ev))
  socket.addEventListener("close", () => {
    console.log("Client disconnected")
  })
})

//Notification listener
;(() => {
  redisSubscriber.subscribe("notification", (err) => {
    if (err) {
      console.log(err)
    } else {
      redisSubscriber.on("message", async (_, message) => {
        const response = await fetch(
          `${process.env.API_GATEWAY}/api/user/one?_id=${message.split("-")[3]}`
        )
        const { nom, prenom, image, googleID } = await response.json()
        const hashedMessage: string = JSON.stringify({
          type: message.split("-")[1],
          post: message.split("-")[2],
          user: {
            nom,
            prenom,
            image,
            googleID,
          },
          comment: message.split("-")[4] || null,
          timeStamps: Date.now(),
          isSeen: false,
        })
        await redisClient.zadd(message.split("-")[0], Date.now(), hashedMessage)
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(hashedMessage)
          }
        })
      })
    }
  })
})()

//Fetch notifications
app.get(
  "/api/notifications",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } =
        req.headers["x-auth-user"] &&
        JSON.parse(req.headers["x-auth-user"] as string)
      const notifications = await redisClient.zrevrange(_id, 0, -1)
      const parsedNotifications: NotificationType[] | [] = notifications
        .map((not) => JSON.parse(not))
        .sort((a, b) => b.timeStamps - a.timeStamps)
      res.status(200).json(parsedNotifications)
    } catch (error: any) {
      res.status(400).json(error.message)
    }
  }
)
//Mark as seen
app.put(
  "/api/notification/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params
    } catch (error: any) {
      res.status(400).json(error.message)
    }
  }
)
server.listen(process.env.PORT, () =>
  console.log(`Notification service running on port ${process.env.PORT}`)
)
