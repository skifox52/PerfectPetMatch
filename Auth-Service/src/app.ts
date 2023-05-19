import express, { Express, Request, Response } from "express"
import "dotenv/config"
import mongoose from "mongoose"
import ErrorHandler from "./middlewares/ErrorHandler.js"
import compression from "compression"
import helmet from "helmet"
import morgan from "morgan"
import authRouter from "./Routes/authRouter.js"
import oauthRouter from "./Routes/oauthRouter.js"

const app: Express = express()
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
//Routes
app.use("/api/auth", authRouter)
app.use("/api/oauth", oauthRouter)
//Not found Route
app.use("/*", (req: Request, res: Response) => {
  res.status(400)
  throw new Error("Not found!")
})
//Error middleware handler
app.use(ErrorHandler)
mongoose.connect(process.env.MONGO_URI as string).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Auth service running on port ${process.env.PORT}`)
  )
})
