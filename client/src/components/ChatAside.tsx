import React, { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { getConversations } from "../api/chatApi"
import { toast } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"

interface ChatAsideProps {
  socket: Socket
  setCurrentUser: React.Dispatch<
    React.SetStateAction<{
      nom: string
      prenom: string
      image: string
      sexe: string
      adresse: string
      date_de_naissance: string
      googleID?: string
    } | null>
  >
}

export const ChatAside: React.FC<ChatAsideProps> = ({
  socket,
  setCurrentUser,
}) => {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { accessToken } = useAuth()?.user!
  const { data, isLoading, isError, error, isSuccess } = useQuery<
    | {
        convId: string
        user: {
          nom: string
          prenom: string
          _id: string
          image: string
          googleID: string
          date_de_naissance: string
          sexe: string
          adresse: string
        }
      }[]
    | [],
    any
  >({
    queryKey: ["conversation", accessToken],
    queryFn: () => getConversations(accessToken),
  })
  useEffect(() => {
    if (conversationId) {
      const currUser =
        data?.length &&
        (data.filter((conv) => conv.convId === conversationId) as any)
      isSuccess &&
        setCurrentUser({
          nom: currUser[0].user.nom,
          prenom: currUser[0].user.prenom,
          date_de_naissance: currUser[0].user.date_de_naissance,
          image: currUser[0].user.image,
          sexe: currUser[0].user.sexe,
          adresse: currUser[0].user.adresse,
          googleID: currUser[0].user.googleID || null,
        })
    }
  }, [conversationId, isSuccess])

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
              if (conversationId === conv.convId) return
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
