import React from "react"
import animationData from "../assets/animations/24622-french-bull-dog-doing-yoga.json"
import Lottie from "lottie-react"
import { Link } from "react-router-dom"

export const HeroSection: React.FC = () => {
  return (
    <header className="w-full h-[30vh]  bg-accent animate-bg overflow-hidden shadow-lg shadow-gray-400">
      <div className="flex  h-full w-full ">
        <section className="flex  py-16 justify-between w-1/2  ">
          <h1 className="text-accent w-full flex flex-col items-center justify-evenly whitespace-pre-line text-7xl font-black text-stroke font-oi">
            Perfect <span className="text-secondary">pet</span>{" "}
            <span className="text-transparent">match</span>
          </h1>
        </section>
        <section className="">
          <Lottie animationData={animationData} className="h-full w-full " />
        </section>
      </div>
    </header>
  )
}
