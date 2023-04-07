import { Request, Response } from "express"
import expressAsyncHandler from "express-async-handler"
import bcrypt from "bcrypt"
import UserModel from "../Models/UserModel.js"
import RefreshTokenModel from "../Models/RefreshTokenModel.js"
import jwt from "jsonwebtoken"
import "dotenv/config"

//Check if User Exists
type UserExistType = (mail: string) => Promise<boolean>
const UserExist: UserExistType = async (mail) => {
  const User = await UserModel.find({ mail })
  return User.length > 0 ? true : false
}
//Sign token
type SignTokenType = ({ _id, role }: { _id: string; role: string }) => string
const SignToken: SignTokenType = ({ _id, role }) => {
  //Do not forget to change the 10h to 10m
  return jwt.sign({ _id, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "100000h",
  })
}
type SingRefreshTokenType = ({ _id }: { _id: string }) => string
const SignRefreshToken: SingRefreshTokenType = (_id) => {
  return jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET!)
}
//Check if RefreshTokenExists
type RefreshTokenExistsType = (refreshToken: string) => Promise<boolean>
const RefreshTokenExists: RefreshTokenExistsType = async (refreshToken) => {
  const refreshExists = await RefreshTokenModel.find({ refreshToken })
  return refreshExists.length > 0 ? true : false
}
//Login a User
export const loginUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { mail, password }: { mail: string; password: string } = req.body
      if (!mail || !password) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      //Check User if Exists
      if (!(await UserExist(mail))) {
        res.status(400)
        throw new Error("User doesn't exist!")
      }
      const User = await UserModel.find({ mail })
      const passwordMatch: boolean = await bcrypt.compare(
        password,
        User[0].mot_de_passe
      )
      if (!passwordMatch) {
        res.status(400)
        throw new Error("Password doesn't match!")
      }
      const accessToken: string = SignToken({
        _id: User[0]._id.toString(),
        role: User[0].role.toString(),
      })
      const refreshToken: string = SignRefreshToken({
        _id: User[0]._id.toString(),
      })
      await RefreshTokenModel.create({
        idUtilisateur: User[0]._id,
        refreshToken,
      })
      res.status(200).json({
        id_user: User[0]._id,
        accessToken,
        refreshToken,
      })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)

//Refresh Access token
export const refreshAccessToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { refreshToken }: { refreshToken: string } = req.body
      if (!refreshToken) {
        res.status(400)
        throw new Error("No token")
      }
      if (!(await RefreshTokenExists(refreshToken))) {
        res.status(400)
        throw new Error("Invalid refresh token!")
      }
      const { iat, ...data }: any = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      )
      const newAccessToken = SignToken(data)
      res.status(200).json({ token: newAccessToken })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Logout
export const logout = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { refreshToken }: { refreshToken: string } = req.body
      if (!refreshToken) {
        res.status(400)
        throw new Error("No refreshToken provided!")
      }
      await RefreshTokenModel.deleteOne({ refreshToken })
      res.status(200).json("User logged out successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)

//Utilie Endpoints for COMMUNICATION
//Generate access token and refreshToken
export const handleTokens = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { _id, role }: { _id: string; role: string } = req.query as {
        _id: string
        role: string
      }
      const accessToken: string = SignToken({ _id, role })
      const refreshToken: string = SignRefreshToken({ _id })
      await RefreshTokenModel.create({
        idUtilisateur: _id,
        refreshToken,
      })
      res.json({ accessToken, refreshToken })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Delete refreshToken after delete if user online
export const deleteRefreshToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { _id }: { _id: string } = req.params as { _id: string }
      await RefreshTokenModel.deleteOne({ idUtilisateur: _id })
      res.status(200).end()
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
