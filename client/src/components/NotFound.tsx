import Lottie from "lottie-react"
import animationData from "../assets/animations/not-found.json"

export const NotFound: React.FC = () => {
  return (
    <div className="h-[90vh] w-screen flex flex-col items-center justify-center bg-bgPrimary">
      <Lottie animationData={animationData} className="w-1/5" />
      <h1 className=" text-3xl font-extrabold text-bold text-gray-700">
        Not Found!
      </h1>
    </div>
  )
}
