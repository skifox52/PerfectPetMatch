import { createContext } from "react"

export interface UserContextType {
  _id: string
  role: string
  accessToken: string
  refreshToken: string
  profilePicture: string
}

export const UserContext = createContext<{
  user: UserContextType | null
  setUser: (value: UserContextType | null) => void
} | null>(null)
