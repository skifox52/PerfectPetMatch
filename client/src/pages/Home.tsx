import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/userContext"

export const Home: React.FC = () => {
  const userContext = useContext(UserContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (userContext?.user === null) navigate("/login")
  }, [])
  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}
