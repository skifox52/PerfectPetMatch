import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import UserModel from "../Models/UserModel.js"
import bcrypt from "bcrypt"
import "dotenv/config"
import FormData from "form-data"
import axios from "axios"

//Check if User Exists
type UserExistType = (mail: string) => Promise<boolean>
const UserExist: UserExistType = async (mail) => {
  const User = await UserModel.find({ mail })
  return User.length > 0 ? true : false
}

//Register a User
export const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        nom,
        prenom,
        mail,
        mot_de_passe,
        sexe,
        adresse,
        date_de_naissance,
      }: {
        nom: string
        prenom: string
        mail: string
        mot_de_passe: string
        sexe: string
        adresse: string
        date_de_naissance: Date
      } = req.body
      if (
        !nom ||
        !prenom ||
        !mail ||
        !mot_de_passe ||
        !sexe ||
        !adresse ||
        !date_de_naissance
      ) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      if (await UserExist(mail)) {
        res.status(400)
        throw new Error("User already exists!")
      }
      const file: Express.Multer.File | undefined = req.file ?? undefined

      //AJAX Reuest to get the fileName and insert the file in the Media-Service
      let mediaPath
      if (file?.buffer !== undefined) {
        const formData = new FormData()
        formData.append("image", file?.buffer, {
          filename: file?.originalname,
          contentType: file?.mimetype,
        })
        console.log(req.body)
        const mediaResponse = await axios.post(
          `http://localhost:${process.env.MEDIA_PORT}/api/media/profile`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          }
        )
        const { imagePath } = mediaResponse.data
        mediaPath = imagePath
      }
      const hashedPassword: string = await bcrypt.hash(mot_de_passe, 10)
      const newUser = new UserModel({
        nom,
        prenom,
        mail,
        mot_de_passe: hashedPassword,
        sexe: sexe.toLowerCase(),
        adresse,
        date_de_naissance,
        image: mediaPath,
      })
      const response = await fetch(
        `http://localhost:${process.env.AUTH_PORT}/api/auth/token/?_id=${newUser._id}&role:${newUser.role}`
      )
      await newUser.save()
      const {
        accessToken,
        refreshToken,
      }: { accessToken: string; refreshToken: string } = await response.json()
      res.status(201).json({
        _id: newUser._id,
        role: newUser.role,
        accessToken,
        refreshToken,
      })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)

//Update a User
export const updateUser = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      await UserModel.findByIdAndUpdate(req.user.id, req.body)
      res.status(200).json(`User [${req.user.id}] updated successfully!`)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Delete a User
export const deleteUser = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      await fetch(
        `http://localhost:${process.env.AUTH_PORT}/api/auth/refreshToken?_id=${req.user.id}`,
        {
          method: "DELETE",
        }
      )
      await UserModel.findByIdAndDelete(req.user._id)
      res.status(200).json(`User [${req.user._id}] deleted successfully!`)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
