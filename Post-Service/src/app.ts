import express, { Express } from "express"
import { connect } from "mongoose"
import morgan from "morgan"
import "dotenv/config"
import compression from "compression"
import ErrorHandler from "./middlewares/ErrorHandler.js"
import postRouter from "./routes/postRouter.js"

const app: Express = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(compression())
app.use(morgan("dev"))

app.use("/api/post", postRouter)

app.use(ErrorHandler)
connect(process.env.MONGO_URI as string).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Post service running on port ${process.env.PORT}`)
  )
})
