import React from "react"
// import animationData from "../assets/animations/24622-french-bull-dog-doing-yoga.json"
import heroImage from "../assets/pictures/heroSection.png"
import { GoSearch } from "react-icons/go"
import logo from "/PPT.png"
import { Link } from "react-router-dom"

export const HeroSection: React.FC = () => {
  return (
    <header className="w-full relative shadow-lg">
      <img
        src={heroImage}
        className="object-center object-contain w-full h-full"
      />
      <div className="absolute top-[20%] flex flex-col text-base-100 left-8 font-montserrat text-[8vw] font-black">
        <h1 className="leading-[9vw]">Perfect Pet</h1>
        <h1 className="leading-[9xvw]">Match</h1>
      </div>
      <img
        src={logo}
        alt="logo"
        className="absolute w-[15vw] top-1/2 left-1/2 -translate-x-[100%]"
      />
      <Link
        to="/contact"
        className="absolute bottom-16 left-10 btn btn-accent text-white text-[1.3vw] w-1/5  h-14 text-center font-black "
      >
        Contactez nous
      </Link>
    </header>
  )
}
