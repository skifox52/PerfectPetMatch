import React from "react"
import Lottie from "lottie-react"
import animationData from "../assets/animations/aboutAnimation.json"

interface AboutProps {}

export const About: React.FC<AboutProps> = ({}) => {
  return (
    <div className="flex min-h-[93vh] flex-col-reverse items-center lg:flex-row px-6 md:px-16 lg:px-32 justify-between">
      <div className="w-full lg:w-4/5">
        <h1 className="text-[10vw] text-primary font-semibold">À propos</h1>
        <p className="text-md lg:text-lg xl:text-xl tracking-wider leading-10 font-semibold text-gray-500 text-justify p-8">
          Bienvenue sur "Perfect Pet Match" - le réseau social dédié aux
          propriétaires d'animaux passionnés ! Notre application est conçue pour
          créer un espace convivial où les amoureux des animaux peuvent se
          connecter, échanger et partager des moments inoubliables avec leurs
          compagnons à quatre pattes. Notre objectif est de faciliter les
          rencontres entre propriétaires d'animaux partageant les mêmes intérêts
          pour l'accouplement ou la reproduction de leurs animaux de compagnie.
          Grâce à "Perfect Pet Match", vous pourrez trouver des correspondances
          idéales pour vos animaux, élargir votre réseau social et partager
          votre passion commune pour les animaux avec d'autres propriétaires
          dévoués.
        </p>
      </div>
      <Lottie
        className="w-full h-2/5 lg:w-2/5 lg:h-full"
        animationData={animationData}
      />
    </div>
  )
}
