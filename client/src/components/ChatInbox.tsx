import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { getUsersSearch } from "../api/userApi"
import { useDebounce } from "../hooks/useDebounce"
import { toast } from "react-hot-toast"
import { joinConversation } from "../api/chatApi"
import { useNavigate } from "react-router-dom"

interface ChatInboxProps {}

export const ChatInbox: React.FC<ChatInboxProps> = ({}) => {
  //Search input
  const [search, setSearch] = useState<string>("")
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  //Fetch data
  const debounceValue = useDebounce(search, 400)
  const [isModal, setIsModal] = useState<boolean>(false)
  const { accessToken, _id } = useAuth()?.user!
  const { data, isError, error, isFetching } = useQuery<
    | {
        _id: string
        nom: string
        prenom: string
        image: string
        googleID: string | undefined
      }[]
    | [],
    any
  >({
    queryKey: ["usersSearch", accessToken, debounceValue],
    queryFn: () => getUsersSearch(accessToken, debounceValue),
    enabled: isModal && debounceValue !== "",
  })
  if (isError) toast.error(error.reponse?.data.err || error.message)
  //Mutation for creating/joining conversation
  const joinConversationMutation = useMutation({
    mutationFn: (variables: { user1: string; user2: string; token: string }) =>
      joinConversation(variables.user1, variables.user2, variables.token),
    onError: (error: any) =>
      toast.error(error.response?.data.err || error.message),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["conversation"])
      navigate(`/messagerie/c/${data.conversationId}`)
    },
  })
  //joinConvOnclick
  const handleJoinConversationClick = (
    elId: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    joinConversationMutation.mutate({
      user1: _id,
      user2: elId,
      token: accessToken,
    })
  }
  return (
    <main className="bg-bgPrimary flex-1 h-full pt-16 first-letter rounded-3xl p-8 flex flex-col gap-6 items-center shadow-md shadow-gray-600">
      <h2 className="font-bold">Commencer une conversation...</h2>

      <label
        htmlFor="my_modal_6"
        className="btn btn-primary text-white btn-sm lowercase"
        onClick={() => setIsModal(true)}
      >
        Ajouter un utilisateur a la conversation
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box overflow-hidden flex flex-col items-center ">
          <input
            type="text"
            className="font-regular text-gray-600  text-lg input input-primary w-2/3 mb-8"
            placeholder="Recherche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {data ? (
            <div className="flex flex-col bg-white border border-gray-300 rounded-xl overflow-y-auto max-h-[60vh]  w-full">
              {data
                .filter((d: any) => d._id !== _id)
                .map((el: any, i: number) => (
                  <div
                    onClick={(e) => handleJoinConversationClick(el._id, e)}
                    key={i}
                    className="flex items-center w-full gap-4 px-2 py-3 border-b hover:cursor-pointer hover:bg-bgPrimary border-gray-300 "
                  >
                    <img
                      src={
                        !!el.googleID
                          ? el.image
                          : `${import.meta.env.VITE_MEDIA_SERVICE}${el.image}`
                      }
                      alt="porfile"
                      className="rounded-full w-10"
                    />
                    <p className="font-semibold">{`${el.nom} ${el.prenom}`}</p>
                  </div>
                ))}
            </div>
          ) : (
            <>
              {isFetching ? (
                <h1 className="text-lg font-bold text-primary">Fetching...</h1>
              ) : (
                <h1 className="text-lg font-bold text-accent">
                  Rechercher un utilisateur
                </h1>
              )}
            </>
          )}
          <div className="modal-action w-1/2">
            <label
              htmlFor="my_modal_6"
              className="btn btn-primary btn-sm text-white w-full"
            >
              Close!
            </label>
          </div>
        </div>
      </div>
    </main>
  )
}
