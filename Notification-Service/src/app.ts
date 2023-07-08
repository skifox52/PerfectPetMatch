import express, { Express } from "express"
import "dotenv/config"
import { Redis } from "ioredis"

const app: Express = express()

//Initialize redis client
const redisClient = new Redis()

const publisher = redisClient.duplicate()

app.get("/", (req, res) => res.send("Hello world"))

app.listen(process.env.PORT, () =>
  console.log(`Notification service running on port ${process.env.PORT}`)
)
