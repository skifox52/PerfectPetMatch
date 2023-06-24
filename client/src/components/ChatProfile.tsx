import React from "react"

interface ChatProfileProps {}

export const ChatProfile: React.FC<ChatProfileProps> = ({}) => {
  return (
    <div className=" w-1/6 rounded-3xl flex flex-col gap-4 shadow-md shadow-gray-600 h-full bg-bgPrimary p-4">
      <div className="flex justify-center mb-4 ">
        <img
          src="https://campussafetyconference.com/wp-content/uploads/2020/08/iStock-476085198.jpg"
          alt=" profile"
          className="w-1/2 rounded-full object-contain object-center shadow-lg"
        />
      </div>
      <ul className="w-full flex-1 bg-white rounded-3xl p-4 flex flex-col gap-2 text-justify">
        <li>
          <h1 className="text-xl font-bold text-black tracking-wide">Nom</h1>
        </li>
        <li>
          <h1 className="text-xl font-bold text-black tracking-wide">Prénom</h1>
        </li>
      </ul>
    </div>
  )
}
