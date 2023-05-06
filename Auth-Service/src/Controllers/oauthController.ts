import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import qs from "querystring"
import "dotenv/config"
import UserModel from "../Models/UserModel.js"
import { SignRefreshToken, SignToken } from "./authController.js"

//Get access token From GoogleOauth
interface GoogleTokensResult {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  id_token: string
}
//User interface
interface GoogleUser {
  id: number
  email: string
  verified_email: boolean
  name: string
  picture: string
  locale: string
  given_name?: string
  family_name?: string
}
type getGoogleOauthGoogleTokenType = (
  code: string
) => Promise<GoogleTokensResult>
const getGoogleOauthGoogleToken: getGoogleOauthGoogleTokenType = async (
  code
) => {
  const url = "https://oauth2.googleapis.com/token"
  const values = {
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    grant_type: "authorization_code",
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: qs.stringify(values),
    })
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Failed to fetch Google oauth Token!")
    throw new Error(error)
  }
}
//Get Google User with access token
type getGoogleUserType = ({
  id_token,
  access_token,
}: {
  id_token: string
  access_token: string
}) => Promise<GoogleUser>
const getGoogleUser: getGoogleUserType = async ({ id_token, access_token }) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Couldn't get Google user!")
    throw new Error(error)
  }
}
//Verifie User's GOOGLEID
interface checkGoogleIdReturnType {
  exist: boolean
  metadata: { _id: string; role: "user" | "admin" } | null
}
const checkGoogleID = async (
  googleID: number
): Promise<checkGoogleIdReturnType> => {
  try {
    const exists = await UserModel.find({ googleID })
    return exists.length > 0
      ? {
          exist: true,
          metadata: { _id: exists[0]._id.toString(), role: exists[0].role },
        }
      : { exist: false, metadata: null }
  } catch (error: any) {
    throw new Error(error)
  }
}

export const oauthRedirectGoogle = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const code = req.query.code as string
      const { id_token, access_token } = await getGoogleOauthGoogleToken(code)
      const googleUser = await getGoogleUser({ id_token, access_token })
      if (!googleUser.verified_email) {
        throw new Error("Validation Error Message: Please validate your email!")
      }
      //Upsert User
      const user: checkGoogleIdReturnType = await await checkGoogleID(
        googleUser.id
      )
      if (!user.exist) {
        const { id, name, given_name, email, family_name, picture } = googleUser
        console.log(googleUser)
        const newUser = await UserModel.create({
          nom: family_name ? given_name : name,
          prenom: given_name ? given_name : name,
          mail: email,
          image: picture,
          googleID: id,
        })
        const accessToken: string = SignToken({
          _id: newUser._id.toString(),
          role: newUser.role.toString(),
        })
        const refreshToken: string = SignRefreshToken({
          _id: newUser._id.toString(),
          role: newUser.role.toString(),
        })
        res.status(200).json({
          id_user: newUser._id,
          accessToken,
          refreshToken,
        })
      }
      //If user Already exist
      const accessToken: string = SignToken({
        _id: user.metadata!._id,
        role: user.metadata!.role.toString(),
      })
      const refreshToken: string = SignRefreshToken({
        _id: user.metadata!._id.toString(),
        role: user.metadata!.role.toString(),
      })
      res.status(200).json({
        id_user: user.metadata!._id,
        accessToken,
        refreshToken,
      })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
