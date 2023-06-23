import express, { Express, Request, Response, response } from "express"
import http from "node:http"
import { connect, Types } from "mongoose"
import { Server as WebSocketServer } from "socket.io"
import morgan from "morgan"
import "dotenv/config"
import ErrorHandler from "./middlewares/ErrorHandler.js"
import expressAsyncHandler from "express-async-handler"
import compression from "compression"
import cors from "cors"
import { ConversationModel, MessageModel } from "./models/ChatModel.js"
import type { ConversationInterface } from "./models/ChatModel.js"
import { Redis } from "ioredis"

//Setting up the redis client
const redisClient = new Redis()
//Express setup
const app: Express = express()
const server = http.createServer(app)
const io = new WebSocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
})
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))
app.use(compression())

//API for opening a conversation
app.post(
  "/api/chat/conversation",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { user1, user2 } = req.body
    const conversationExist: ConversationInterface | null =
      await ConversationModel.conversationExist([user1, user2])
    let conversationId: Types.ObjectId
    if (conversationExist) {
      conversationId = conversationExist._id
    } else {
      const newConversation: ConversationInterface =
        await ConversationModel.create({
          users: [new Types.ObjectId(user1), new Types.ObjectId(user2)],
        })
      conversationId = newConversation._id
    }
    res.status(200).json({ conversationId: conversationId })
  })
)

//API for sendig message
app.post(
  "/api/chat/message",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { conversationId, sender, message } = req.body
    const newMessage = await MessageModel.create({
      conversation: new Types.ObjectId(conversationId),
      sender: new Types.ObjectId(sender),
      content: message,
    })
    //Emit the messgage to the participant of the conversation
    io.to(conversationId).emit("newMessage", newMessage)
    res.status(200).json({ message: "Message sent successfully!" })
  })
)
//API for getting user conversations
app.get(
  "/api/chat/conversation",
  expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { _id } = JSON.parse(req.headers["x-auth-user"] as string)
    const conversations = await ConversationModel.find({
      users: { $in: _id },
    }).select("_id users")
    const filteredConversations = conversations.map((con) => {
      return {
        convId: con._id,
        user: con.users.filter((u) => u.toString() !== _id).toString(),
      }
    })
    await Promise.all(
      filteredConversations.map(async (conv) => {
        const response = await fetch(
          `${process.env.API_GATEWAY}/api/user/one?_id=${conv.user}`
        )
        const jsonresponse = await response.json()
        conv.user = jsonresponse
      })
    )
    res.status(200).json(filteredConversations)
  })
)
//API for getting conversation history
app.get(
  "/api/chat/messages/:conversationId",
  expressAsyncHandler(
    async (req: Request<{ conversationId: string }>, res: Response) => {
      const { conversationId } = req.params
      const messages = await MessageModel.find({
        conversation: conversationId,
      })
      res.status(200).json(messages)
    }
  )
)

//Websockets connections handeling
io.on("connection", (socket: any) => {
  console.log("New connection", socket.id)

  //Handeling joining conversation
  socket.on("joinConversation", (conversationId: string) => {
    console.log("Joined conversation number ", conversationId)
    socket.join(conversationId)
  })

  //Handeling incoming chat messages from the client
  socket.on("sendMessage", async (data: any) => {
    const { conversationId, senderId, content } = data
    try {
      // const newMessage = await MessageModel.create({
      //   conversation: conversationId,
      //   sender: senderId,
      //   content: content,
      // })
      //Save message to redis
      const newMessage = {
        sender: senderId,
        content: content,
        timeStamps: Date.now(),
      }
      await redisClient.hmset(conversationId, newMessage)
      //Emit the message to the participent of the conversation
      io.to(conversationId).emit("newMessage", newMessage)
    } catch (error: any) {
      console.error(error)
      throw new Error(error)
    }
  })
  //Handeling disconnection
  socket.on("disconnected", () => {
    console.log("Disconnected: ", socket.id)
  })
})

//Error Handler
app.use(ErrorHandler)
connect(process.env.MONGO_URI as string)
  .then(() => {
    server.listen(process.env.PORT, () =>
      console.log(`Chat service running at port ${process.env.PORT}`)
    )
  })
  .catch((err: any) => {
    console.log(err)
  })
