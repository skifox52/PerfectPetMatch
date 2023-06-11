import React from "react"

interface ChatAsideProps {
  conversations: { _id: string; users: string[] }[]
}

export const ChatAside: React.FC<ChatAsideProps> = ({ conversations }) => {
  return (
    <aside className="w-[20vw]  h-5/6 rounded-3xl  p-2 bg-base-300 shadow-md shadow-gray-600">
      {conversations.map((conv) => (
        <div
          key={conv._id}
          className="btn btn-primary text-white font-black w-full   flex  gap-4 justify-center items-center border-b-primary"
        >
          <h2>{conv.users[0]}</h2>
          <h2>{conv.users[1]}</h2>
        </div>
      ))}
    </aside>
  )
}
