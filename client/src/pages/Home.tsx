import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/userContext"
import { HomeContainer } from "../components/HomeContainer"
import { HeroSection } from "../components/HeroSection"

export const Home: React.FC = () => {
  const userContext = useContext(UserContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (userContext?.user === null) navigate("/login")
  }, [])
  return (
    <div className="min-h-screen max-w-screen p-8 bg-base-200 ">
      <HeroSection />
      <HomeContainer />
    </div>
  )
}
