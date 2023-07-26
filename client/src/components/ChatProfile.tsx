import React from "react"
import { Link, useParams } from "react-router-dom"

interface ChatProfileProps {
  currentUser: {
    _id: string
    nom: string
    prenom: string
    image: string
    sexe: string
    adresse: string
    date_de_naissance: string
    googleID?: string
  } | null
}
export const ChatProfile: React.FC<ChatProfileProps> = ({ currentUser }) => {
  const { conversationId } = useParams()
  if (!conversationId)
    return (
      <div className="w-1/6 hidden lg:flex rounded-3xl lg:h-[80vh]  flex-col gap-4 shadow-md shadow-gray-600 h-full bg-bgPrimary p-4"></div>
    )

  return (
    <div className=" w-1/6 hidden lg:flex rounded-3xl lg:h-[80vh]  flex-col gap-4 shadow-md shadow-gray-600 h-full bg-bgPrimary p-4">
      <div className="flex justify-center mb-4 ">
        <img
          src={
            currentUser?.googleID
              ? currentUser?.image
              : `${import.meta.env.VITE_MEDIA_SERVICE}${currentUser?.image}`
          }
          alt=" profile"
          className="w-1/2 rounded-full object-contain object-center shadow-lg"
        />
      </div>
      <ul className="w-full flex-1 bg-white rounded-3xl p-4 flex flex-col gap-2 text-justify">
        <li className="flex flex-col mb-4 gap-1 justify-between items-start">
          <h1 className="text-xl font-bold text-black tracking-wide">Nom</h1>
          <h3 className="font-semibold text-gray-600">{currentUser?.nom}</h3>
        </li>
        <li className="flex flex-col mb-4 gap-1 justify-between items-start">
          <h1 className="text-xl font-bold text-black tracking-wide">Prénom</h1>
          <h3 className="font-semibold text-gray-600">{currentUser?.prenom}</h3>
        </li>
        <li className="flex flex-col mb-4 gap-1 justify-between items-start">
          <h1 className="text-xl font-bold text-black tracking-wide">Sexe</h1>
          <h3 className="font-semibold text-gray-600">{currentUser?.sexe}</h3>
        </li>
        <li className="flex flex-col mb-4 gap-1 justify-between items-start">
          <h1 className="text-xl font-bold text-black tracking-wide">
            Adresse
          </h1>
          <h3 className="font-semibold text-gray-600">
            {currentUser?.adresse}
          </h3>
        </li>
        <li className="flex flex-col mb-4 gap-1 justify-between items-start">
          <h1 className="text-xl font-bold text-black tracking-wide">
            Date de naissance
          </h1>
          <h3 className="font-semibold text-gray-600">
            {currentUser?.date_de_naissance.toString().slice(0, 10)}
          </h3>
        </li>
      </ul>
      <div className="flex flex-col gap-2">
        <Link
          to={"/profile/" + currentUser?._id}
          className="btn btn-primary font-bold text-lg text-gray-50"
        >
          Voir profile
        </Link>
      </div>
    </div>
  )
}
