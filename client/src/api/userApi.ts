import axios from "axios"
import type { UserInputInterface } from "../pages/Login"

export interface UserType {
  nom: string
  prenom: string
  mail: string
  mot_de_passe: string
  confirmer_mot_de_passe?: string
  sexe: string
  adresse: string
  date_de_naissance: Date | null
  image?: File | null
  ville: string
}

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
//Register a User
export const registerUser = async (userData: FormData) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_REGISTER_URI,
      userData
    )
    return response.data
  } catch (error) {
    throw error
  }
}
