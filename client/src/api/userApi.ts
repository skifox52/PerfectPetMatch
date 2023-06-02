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
      `${import.meta.env.VITE_USER_URI}/register`,
      userData
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Reset passworrd [Sending mail]
export const resetPassword = async (
  mail: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_USER_URI}/resetPassword`,
      { mail }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Check if reset key is valid
export const isResetKeyValide = async (
  resetKey: string
): Promise<{ exist: boolean; mail: string | null }> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USER_URI}/resetKeyExist`,
      { key: resetKey }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Update user Password
export const updatePassword = async (
  mail: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_USER_URI}/updatePassword?mail=${mail}`,
      { password }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
