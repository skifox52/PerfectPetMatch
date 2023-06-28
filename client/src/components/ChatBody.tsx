import React, { useEffect, useRef, useState } from "react"
import { FiSend } from "react-icons/fi"
import { useOutletContext, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"
import { useAuth } from "../hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { getConversationMessages } from "../api/chatApi"
import toast from "react-hot-toast"

interface ChatBodyProps {}

export const ChatBody: React.FC<ChatBodyProps> = ({}) => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<string[]>([])
  const socket: Socket = useOutletContext()
  const { _id, accessToken } = useAuth()!.user!
  const { conversationId } = useParams()
  const [message, setMessage] = useState<string>("")
  //Auto scroll
  const scrollToBottom = () => {
    chatBoxRef.current?.scrollIntoView()
  }
  useEffect(() => {
    scrollToBottom()
    console.log("djf")
  }, [messages])
  //Join conversation
  useEffect(() => {
    socket.emit("joinConversation", conversationId)
    scrollToBottom()
  }, [])
  //Handle onSubmit
  const hendleSendMessage: any = () => {
    if (message === "") return
    const data = { conversationId, senderId: _id, content: message }
    setMessage("")
    socket.emit("sendMessage", data)
  }
  //Load conversation loaded messages
  const { data, error, isError, isLoading, isSuccess } = useQuery<
    string[],
    any
  >({
    queryKey: ["messages", accessToken, conversationId],
    queryFn: () =>
      getConversationMessages(
        accessToken,
        conversationId?.toString() as string
      ),
    refetchOnMount: "always",
  })
  if (isError) {
    toast.error(error.response?.err.data || error.message)
  }
  useEffect(() => {
    isSuccess && setMessages(data!)
    return () => setMessages([])
  }, [conversationId, isLoading])
  //Recieved messages

  useEffect(() => {
    socket.on("newMessage", (data) => {
      setMessages((prev) => {
        return [
          ...prev,
          JSON.stringify({
            sender: data.sender,
            content: data.content,
            timeStamps: data.timeStamps,
          }),
        ]
      })
    })
  }, [socket])
  if (isLoading) return <h1>Loading...</h1>
  return (
    <main className="bg-bgPrimary flex-1 h-full first-letter rounded-3xl p-8 flex flex-col gap-6 items-center shadow-md shadow-gray-600">
      <section className="rounded-xl bg-base-100 py-8 h-[80%] overflow-y-auto w-full px-4 block flex-1 border-gray-300 border shadow-md">
        {isSuccess &&
          messages.map((el, i) => (
            <div className="chat chat-end flex flex-col" key={i}>
              <div className="bg-primary px-2 py-1 rounded-xl font-semibold text-gray-50">
                {JSON.parse(el).content}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(parseInt(JSON.parse(el).timeStamps)).getHours() +
                  " : " +
                  new Date(parseInt(JSON.parse(el).timeStamps)).getMinutes()}
              </span>
            </div>
          ))}
        <div ref={chatBoxRef}></div>
      </section>
      <section className="h-16 w-full rounded-3xl relative flex items-center shadow-md">
        <div className="h-full w-full">
          <input
            type="text"
            name="chatBody"
            placeholder="Saisissez votre message..."
            className="h-full w-full rounded-3xl pl-6  input border-2 input-primary font-bold tracking-wide pr-16"
            value={message}
            onKeyDown={(e) => e.key === "Enter" && hendleSendMessage(e)}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={hendleSendMessage}
            className="absolute right-6 h-full w-8 text-neutral hover:text-primary cursor-pointer"
          >
            <FiSend className="h-full w-full" />
          </button>
        </div>
      </section>
    </main>
  )
}
