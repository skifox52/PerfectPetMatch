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
    const response = await axios.post(
      `${import.meta.env.VITE_API_GATEWAY}/api/auth/login`,
      {
        mail,
        password,
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Register a User
export const registerUser = async (userData: FormData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_GATEWAY}/api/user/register`,
      userData
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Get all users
export const getAllUsers = async (token: string) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get(
      `${import.meta.env.VITE_API_GATEWAY}/api/user/all`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Get users by search
export const getUsersSearch = async (token: string, searchParam: string) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_GATEWAY
      }/api/user/search?search=${searchParam}`,
      config
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
      `${import.meta.env.VITE_API_GATEWAY}/api/user/resetPassword`,
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
      `${import.meta.env.VITE_API_GATEWAY}/api/user/resetKeyExist`,
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
      `${
        import.meta.env.VITE_API_GATEWAY
      }/api/user/updatePassword?mail=${mail}`,
      { password }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//User exist
//--By Id
export const findById = async (_id: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_GATEWAY}/api/user/one?_id=${_id}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//--By Mail
export const findByMail = async (mail: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_GATEWAY}/api/user/oneByMail?mail=${mail}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Update the user after Google authentifiacation
export const updateGoogleUser = async (id: string, data: UserType) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_GATEWAY}/api/user/updateGoogleUser?_id=${id}`,
      data
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Logou | delete refreshToken from the database
export const logoutUser = async (refreshToken: string, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    await axios.delete(
      `${
        import.meta.env.VITE_API_GATEWAY
      }/api/auth/logout?refreshToken=${refreshToken}`,
      config
    )
    return { success: true, message: "Logged out successfully" }
  } catch (error) {
    throw error
  }
}
//Fetch current user
export const fetchCurrentUser = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_GATEWAY}/api/user/currentUser`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
