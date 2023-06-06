import React from "react"
import animationData from "../assets/animations/24622-french-bull-dog-doing-yoga.json"
import Lottie from "lottie-react"
import { Link } from "react-router-dom"

export const HeroSection: React.FC = () => {
  return (
    <header className="w-full h-[80vh] rounded-xl bg-primary overflow-hidden shadow-lg shadow-secondary mb-8">
      <div className="flex  h-[100%] w-full ">
        <section className="flex-1 flex flex-col py-16 justify-between p-8">
          <h1 className="text-accent w-2/3 whitespace-pre-line text-9xl font-black text-stroke font-oi">
            Perfect <span className="text-secondary">pet</span>{" "}
            <span className="text-transparent">match</span>
          </h1>
          <Link
            to={"/about"}
            target="_blank"
            className="btn btn-secondary hover:tracking-widest transition-all duration-200  border-white border-4 text-2xl font-black py-8 flex flex-col items-center w-2/3 text-white"
          >
            What is perfect pet match ?
          </Link>
        </section>
        <section className="">
          <Lottie animationData={animationData} className="h-full " />
        </section>
      </div>
    </header>
  )
}
