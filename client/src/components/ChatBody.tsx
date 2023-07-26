import React, { useEffect, useRef, useState } from "react"
import { FiSend } from "react-icons/fi"
import { useOutletContext, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"
import { useAuth } from "../hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { getConversationMessages, getMessagesOnScroll } from "../api/chatApi"
import toast from "react-hot-toast"

interface ChatBodyProps {}

export const ChatBody: React.FC<ChatBodyProps> = ({}) => {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const scrollTopElement = useRef<HTMLDivElement>(null)
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
  }, [messages])
  // Join conversation
  useEffect(() => {
    socket.emit("joinConversation", conversationId)
    scrollToBottom()
  }, [conversationId])
  //Handle onSubmit
  const handleSendMessage: any = () => {
    if (message === "") return
    const data = { conversationId, senderId: _id, content: message }
    setMessage("")
    refetch()
    socket.emit("sendMessage", data)
  }
  //Load conversation loaded messages
  const { data, error, isError, isLoading, isSuccess, refetch } = useQuery<
    string[],
    any
  >({
    queryKey: ["messages", accessToken, conversationId],
    queryFn: () =>
      getConversationMessages(
        accessToken,
        conversationId?.toString() as string
      ),
  })
  if (isError) {
    toast.error(error.response?.err.data || error.message)
  }

  useEffect(() => {
    isSuccess && setMessages(data!)
    refetch()
    return () => {
      setMessages([])
    }
  }, [conversationId, isLoading, data, socket])

  //Recieved messages
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      refetch()
      console.log(data)
    }
    socket.on("newMessage", handleNewMessage)
    return () => {
      socket.off("newMessage", handleNewMessage)
    }
  }, [socket, conversationId, messages])
  if (isLoading) return <h1>Loading...</h1>
  return (
    <main className="bg-bgPrimary w-full  flex-1 h-[80vh] first-letter rounded-3xl p-8 flex flex-col gap-6 items-center shadow-md shadow-gray-600">
      <section
        ref={scrollTopElement}
        className="rounded-xl bg-base-100 py-8 h-[80%] overflow-y-auto w-full px-4 block flex-1 border-gray-300 border shadow-md"
      >
        {isSuccess &&
          messages.map((el, i) => (
            <div
              className={
                JSON.parse(el).sender === _id
                  ? "chat chat-end flex flex-col"
                  : "chat chat-start flex flex-col"
              }
              key={JSON.parse(el).timeStamps + i}
            >
              <div
                className={
                  JSON.parse(el).sender === _id
                    ? "bg-primary px-2 py-1 rounded-xl font-semibold text-gray-50  border border-gray-200"
                    : "bg-bgPrimary px-2 py-1 rounded-xl font-semibold text-gray-60 border border-gray-200"
                }
              >
                {JSON.parse(el).content}
              </div>
              <span className="text-xs text-gray-400 p-1 pb-2">
                {JSON.parse(el).sender === _id && (
                  <span className="font-bold text-gray-600">You</span>
                )}{" "}
                {new Date(parseInt(JSON.parse(el).timeStamps)).getHours() +
                  " : " +
                  (new Date(parseInt(JSON.parse(el).timeStamps))
                    .getMinutes()
                    .toString().length === 1
                    ? "0" +
                      new Date(parseInt(JSON.parse(el).timeStamps)).getMinutes()
                    : new Date(
                        parseInt(JSON.parse(el).timeStamps)
                      ).getMinutes())}
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
            className="h-full w-full rounded-3xl pl-6  input border-2 input-primary py-3 font-bold tracking-wide pr-16"
            value={message}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-6 h-full w-8 text-neutral hover:text-primary cursor-pointer"
          >
            <FiSend className="h-full w-full" />
          </button>
        </div>
      </section>
    </main>
  )
}
