import React, { useEffect, useState } from "react"
import { FiSend } from "react-icons/fi"
import { useOutletContext, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"
import { useAuth } from "../hooks/useAuth"

interface ChatBodyProps {}

export const ChatBody: React.FC<ChatBodyProps> = ({}) => {
  const [recievedMessage, setRecievedMessage] = useState<
    { sender: string; content: string; timeStamps: number }[]
  >([])
  const socket: Socket = useOutletContext()
  const { _id } = useAuth()!.user!
  const { conversationId } = useParams()
  const [message, setMessage] = useState<string>("")
  //Handle onSubmit
  const handleOnSubmite: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (message === "") return
    const data = { conversationId, senderId: _id, content: message }
    setMessage("")
    socket.emit("sendMessage", data)
  }
  //Recieved messages
  console.log(recievedMessage)
  useEffect(() => {
    socket.on("newMessage", (data) => {
      console.log(data)
      setRecievedMessage((prev) => {
        return [
          ...prev,
          {
            sender: data.sender,
            content: data.content,
            timeStamps: data.timeStamps,
          },
        ]
      })
    })
  }, [socket])
  useEffect(() => {
    setRecievedMessage([])
  }, [conversationId])
  return (
    <main className="bg-bgPrimary flex-1 h-full first-letter rounded-3xl p-8 flex flex-col gap-6 items-center shadow-md shadow-gray-600">
      <section className="rounded-3xl bg-base-100 w-full block flex-1 border-gray-300 border shadow-md">
        {recievedMessage.map((el, i) => (
          <h2 key={i} className="text-text-xl font-bold">
            {el.content}
          </h2>
        ))}
      </section>
      <section className="h-16 w-full rounded-3xl relative flex items-center shadow-md">
        <form onSubmit={handleOnSubmite} className="h-full w-full">
          <input
            type="text"
            name="chatBody"
            placeholder="Saisissez votre message..."
            className="h-full w-full rounded-3xl pl-6  input border-2 input-primary font-bold tracking-wide pr-16"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-6 h-full w-8 text-neutral hover:text-primary cursor-pointer"
          >
            <FiSend className="h-full w-full" />
          </button>
        </form>
      </section>
    </main>
  )
}
