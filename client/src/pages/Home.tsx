import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/userContext"
import animationData from "../assets/animations/24622-french-bull-dog-doing-yoga.json"
import Lottie from "lottie-react"
import { Navbar } from "../components/Navbar"

export const Home: React.FC = () => {
  const userContext = useContext(UserContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (userContext?.user === null) navigate("/login")
  }, [])
  return (
    <div className="min-h-screen w-screen p-4 bg-base-200">
      <header className="w-full h-[80vh] rounded-xl bg-primary overflow-hidden">
        <Navbar />
        <div className="flex  h-[90%] w-full ">
          <section className="flex-1 flex flex-col py-16 justify-between p-8">
            <h1 className="text-accent w-2/3 whitespace-pre-line text-9xl font-black text-stroke font-oi">
              Perfect <span className="text-secondary">pet</span>{" "}
              <span className="text-transparent">match</span>
            </h1>
            <button className="btn btn-secondary  border-white border-4 text-2xl font-black py-8 flex flex-col items-center w-2/3 text-white">
              What is perfect pet match ?
            </button>
          </section>
          <section className="">
            <Lottie animationData={animationData} className="h-full " />
          </section>
        </div>
      </header>
      <h1>Hello</h1>
    </div>
  )
}
