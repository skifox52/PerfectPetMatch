import express from "express"
import "dotenv/config"
import mongoose from "mongoose"
import ErrorHandler from "./middlewares/ErrorHandler.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(ErrorHandler)
mongoose.connect(process.env.MONGO_URI!).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Auth service running on port ${5000}`)
  )
})
