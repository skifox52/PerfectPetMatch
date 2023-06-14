import { Request, Response } from "express"
import expressAsyncHandler from "express-async-handler"
import bcrypt from "bcrypt"
import UserModel from "../Models/UserModel.js"
import RefreshTokenModel from "../Models/RefreshTokenModel.js"
import jwt from "jsonwebtoken"
import "dotenv/config"

//Sign token
type SignTokenType = ({ _id, role }: { _id: string; role: string }) => string
export const SignToken: SignTokenType = ({ _id, role }) => {
  //Do not forget to change the 10h to 10m
  return jwt.sign({ _id, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "100000h",
  })
}
type SingRefreshTokenType = ({
  _id,
  role,
}: {
  _id: string
  role: string
}) => string
export const SignRefreshToken: SingRefreshTokenType = ({ _id, role }) => {
  return jwt.sign({ _id, role }, process.env.REFRESH_TOKEN_SECRET!)
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
      if (!(await UserModel.userExists(mail))) {
        res.status(400)
        throw new Error("L'utilisateur n'éxiste pas!")
      }
      const User = await UserModel.find({ mail })
      if (User[0].googleID) {
        throw new Error("Connectez vous avec votre compte Google")
      }
      const passwordMatch: boolean = await bcrypt.compare(
        password,
        User[0].mot_de_passe!
      )
      if (!passwordMatch) {
        res.status(400)
        throw new Error("Mot de passe incorrect")
      }

      const accessToken: string = SignToken({
        _id: User[0]._id.toString(),
        role: User[0].role!.toString(),
      })
      const refreshToken: string = SignRefreshToken({
        _id: User[0]._id.toString(),
        role: User[0].role!.toString(),
      })
      await RefreshTokenModel.create({
        idUtilisateur: User[0]._id,
        refreshToken,
      })
      res.status(200).json({
        _id: User[0]._id,
        accessToken,
        refreshToken,
        role: User[0].role,
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
      if (!(await RefreshTokenModel.refreshExists(refreshToken))) {
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
  async (req: Request<{}, {}, {}, { refreshToken: string }>, res: Response) => {
    try {
      const { refreshToken } = req.query
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
      const refreshToken: string = SignRefreshToken({ _id, role })
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
//Save refreshToken in the database
export const saveRefresh = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { refreshToken, _id } = req.body
      if (!refreshToken || !_id) {
        throw new Error("No refresh token provided!")
      }
      await RefreshTokenModel.create({
        idUtilisateur: _id,
        refreshToken: refreshToken,
      })
      res.send({ success: true })
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
