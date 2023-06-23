import React from "react"
import { useAuth } from "../hooks/useAuth"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getConversations, joinConversation } from "../api/chatApi"
import { toast } from "react-hot-toast"

interface ChatAsideProps {}

export const ChatAside: React.FC<ChatAsideProps> = ({}) => {
  const { accessToken, _id } = useAuth()?.user!
  //Join conversation mutation
  const joinConversationMutation = useMutation({
    mutationFn: (variables: { user1: string; user2: string }) =>
      joinConversation(variables.user1, variables.user2),
  })
  //Get all conversations
  const { data, isLoading, isError, error } = useQuery<
    | { convId: string; user: { nom: string; prenom: string; _id: string } }[]
    | [],
    any
  >({
    queryKey: ["conversation", accessToken],
    queryFn: () => getConversations(accessToken),
  })
  if (isError) toast.error(error.response?.data.err || error.message)
  if (isLoading)
    return (
      <aside className="w-[20vw]  h-5/6 rounded-3xl flex flex-col gap-2  p-2 bg-base-300 items-center justify-center shadow-md shadow-gray-600">
        <h1 className="text-accent font-bold text-lg">Loading</h1>
      </aside>
    )
  return (
    <aside className="w-[20vw]  h-5/6 rounded-3xl flex flex-col gap-2  p-2 bg-base-300 shadow-md shadow-gray-600">
      {data &&
        data.map((conv) => (
          <div
            key={conv.convId}
            className="btn btn-primary text-white font-bold text-xs w-full   flex  gap-4 justify-center items-center border-b-primary"
            onClick={() => console.log("hello")}
          >
            <h2>{conv.user.nom}</h2>
          </div>
        ))}
    </aside>
  )
}
