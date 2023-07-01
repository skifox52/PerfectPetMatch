import React from "react"

interface ChatProfileProps {
  currentUser: {
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
  // console.log(currentUser)
  return (
    <div className=" w-1/6 rounded-3xl flex flex-col gap-4 shadow-md shadow-gray-600 h-full bg-bgPrimary p-4">
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
        <button className="btn btn-primary font-bold text-lg text-gray-50">
          Voir profile
        </button>
        <button className="btn btn-error font-bold text-lg text-gray-50">
          Bloquer
        </button>
      </div>
    </div>
  )
}
