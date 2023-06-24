import React from "react"
import { useAuth } from "../hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { getConversations } from "../api/chatApi"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Socket } from "socket.io-client"

interface ChatAsideProps {
  socket: Socket
}

export const ChatAside: React.FC<ChatAsideProps> = ({ socket }) => {
  const navigate = useNavigate()
  const { accessToken, _id } = useAuth()?.user!
  const { data, isLoading, isError, error } = useQuery<
    | {
        convId: string
        user: {
          nom: string
          prenom: string
          _id: string
          image: string
          googleID: string
        }
      }[]
    | [],
    any
  >({
    queryKey: ["conversation", accessToken],
    queryFn: () => getConversations(accessToken),
  })

  if (isError) toast.error(error.response?.data.err || error.message)
  if (isLoading)
    return (
      <aside className="w-[20vw]  h-full rounded-3xl flex flex-col gap-2  p-2 bg-bgPrimary items-center justify-center shadow-md shadow-gray-600">
        <h1 className="text-accent font-bold text-lg">Loading...</h1>
      </aside>
    )
  return (
    <aside className="w-[20vw]  h-full rounded-3xl flex flex-col gap-2  p-2 bg-bgPrimary shadow-md shadow-gray-600">
      {data &&
        data.map((conv) => (
          <div
            key={conv.convId}
            className="btn bg-white  text-gray-600 font-bold text-xs w-full hover:bg-primary hover:text-white hover:bg-opacity-70 hover:border-gray-200 border-gray-300 relative flex  gap-4 justify-center items-center"
            onClick={(e) => {
              socket.emit("joinConversation", conv.convId)
              navigate(`/messagerie/c/${conv.convId}`)
            }}
          >
            <img
              src={
                conv.user.googleID
                  ? conv.user.image
                  : `${import.meta.env.VITE_MEDIA_SERVICE}${conv.user.image}`
              }
              alt="profilePicture"
              className="h-[95%] rounded-full absolute left-[1%]"
            />
            <h2>
              {conv.user.nom} {conv.user.prenom}
            </h2>
          </div>
        ))}
    </aside>
  )
}
