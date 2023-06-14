import { useContext } from "react"
import { UserContext, UserContextType } from "../contexts/userContext"

export const useAuth = (): {
  user: UserContextType | null
  setUser: (value: UserContextType | null) => void
} | null => {
  return useContext(UserContext)
}
