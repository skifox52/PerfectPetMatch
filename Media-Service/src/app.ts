import express, { Request, Response, Express } from "express"
import "dotenv/config"
import compression from "compression"
import expressAsyncHandler from "express-async-handler"
import ErrorHandler from "./middlewares/ErrorHandler.js"
import morgan from "morgan"
import helmet from "helmet"
import multer from "multer"
import sharp from "sharp"

const app: Express = express()
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())

const upload = multer({
  storage: multer.memoryStorage(),
})
app.post(
  "/api/media/profile",
  upload.single("image"),
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const file = req.file
      const randomId: number = Date.now()
      const { width, height, format, channels } = await sharp(
        file?.buffer
      ).metadata()
      await sharp(file?.buffer)
        .resize(500, 500)
        .jpeg({ quality: 80 })
        .toFile(`./assets/ProfilePictures/${randomId}-PofilePicture.${format}`)
      const imagePath: string = `/assets/ProfilePictures/${randomId}-PofilePicture.${format}`
      res.json({ imagePath, width, height, format, channels })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  })
)

//Not found Route
app.use("/*", (req: Request, res: Response) => {
  res.status(400)
  throw new Error("Not found!")
})

app.use(ErrorHandler)
app.listen(process.env.PORT, () =>
  console.log(`Media Service running on port ${process.env.PORT}`)
)