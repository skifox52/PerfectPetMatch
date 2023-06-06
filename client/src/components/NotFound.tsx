import Lottie from "lottie-react"
import animationData from "../assets/animations/not-found.json"

export const NotFound: React.FC = () => {
  return (
    <div className="h-[90vh] w-screen flex flex-col items-center justify-center bg-accent">
      <Lottie animationData={animationData} className="w-2/5" />
      <h1 className=" text-5xl font-extrabold text-base-200">Not Found!</h1>
    </div>
  )
}
