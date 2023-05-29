import { createContext } from "react"

export interface UserContextType {
  _id: string
  role: string
  accessToken: string
  refreshToken: string
}

export const UserContext = createContext<{
  user: UserContextType | null
  setUser: (value: UserContextType) => void
} | null>(null)
