import axios from "axios"
import { useContext } from "react"
import type { UserInputInterface } from "../pages/Login"

//Login the user
export const loginUser = async ({ mail, password }: UserInputInterface) => {
  try {
    const response = await axios.post(import.meta.env.VITE_LOGIN_URI, {
      mail,
      password,
    })
    return response.data
  } catch (error) {
    throw error
  }
}
