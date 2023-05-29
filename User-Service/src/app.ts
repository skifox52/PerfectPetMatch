import express, { Express, Request, Response } from "express"
import "dotenv/config"
import mongoose from "mongoose"
import ErrorHandler from "./middlewares/ErrorHandler.js"
import compression from "compression"
import userRouter from "./Routes/userRouter.js"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
// import ip from "ip"

const app: Express = express()
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
//Routes
app.use("/api/user", userRouter)

//Not found Route
app.use("/*", (req: Request, res: Response) => {
  res.status(400)
  throw new Error("Not found!")
})
//Error middleware handler
app.use(ErrorHandler)
mongoose.connect(process.env.MONGO_URI as string).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`User service running on port ${process.env.PORT}`)
  )
})
