import Lottie from "lottie-react"
import animationData from "../assets/animations/loading-dog.json"

export const LoadingDog: React.FC = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-base-200">
      <Lottie animationData={animationData} className="w-1/5" />
    </div>
  )
}
