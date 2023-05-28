import express, { Request, Response, Express } from "express"
import "dotenv/config"
import compression from "compression"
import expressAsyncHandler from "express-async-handler"
import ErrorHandler from "./middlewares/ErrorHandler.js"
import morgan from "morgan"
import multer from "multer"
import sharp from "sharp"
import { mkdir } from "node:fs/promises"

const app: Express = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())

const upload = multer({
  storage: multer.memoryStorage(),
})

//Post profile pictures and store them in assets/profilePictures
app.post(
  "/api/media/profile",
  upload.single("image"),
  expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file
      const randomId: number = Date.now()
      const { format } = await sharp(file?.buffer).metadata()
      await sharp(file?.buffer)
        .resize(500, 500)
        .jpeg({ quality: 80 })
        .toFile(`./assets/ProfilePictures/${randomId}-PofilePicture.${format}`)
      const imagePath: string = `/assets/ProfilePictures/${randomId}-PofilePicture.${format}`
      res.json({ imagePath })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  })
)
//Post Post pictures and store them in assets/postPictures
app.post(
  "/api/media/post",
  upload.array("images"),
  expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const files: any = req.files
      console.log(req.headers["x-media-user"])
      //Create folder for the post
      let folderName: string
      if (files.length > 0) {
        folderName = `Post-${Date.now()}`
        await mkdir(`./assets/PostPictures/${folderName}`)
      }
      const randomId: number = Date.now()
      const imagePath: string[] = []
      files?.length &&
        (await Promise.all(
          files?.map(async (file: Express.Multer.File, i: number) => {
            const { format } = await sharp(file.buffer).metadata()
            await sharp(file.buffer)
              .resize(1000, 1000)
              .jpeg({ quality: 80 })
              .toFile(
                `./assets/PostPictures/${folderName}/${randomId}-PostPicture${i}.${format}`
              )
            imagePath.unshift(
              `./assets/PostPictures/${folderName}/${randomId}-PostPicture${i}.${format}`
            )
          })
        ))
      res.status(200).json(imagePath)
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
