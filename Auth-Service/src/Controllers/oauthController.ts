import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import qs from "querystring"
import "dotenv/config"

//Get access token From GoogleOauth
interface GoogleTokensResult {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  id_token: string
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
}) => Promise<GoogleTokensResult>
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

export const oauthRedirectGoogle = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string
      const { id_token, access_token } = await getGoogleOauthGoogleToken(code)
      const googleUser = await getGoogleUser({ id_token, access_token })
      console.log({ googleUser })
      //Upsert User
    } catch (error) {}
  }
)
