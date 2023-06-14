import React, { useEffect, useState } from "react"
import { ChatAside } from "../components/ChatAside"
import { ChatBody } from "../components/ChatBody"
import { ChatProfile } from "../components/ChatProfile"
import io from "socket.io-client"
import { toast } from "react-hot-toast"

export const Messages: React.FC = () => {
  const socket = io("http://localhost:5005")
  const [conversations, setConversations] = useState<
    { _id: string; users: string[] }[]
  >([{ _id: "my conv", users: ["user1", "user2"] }])
  //Join conversation
  const joinConversation = () => {
    socket.emit("")
  }
  //Join message
  const sendMessage = (message: string) => {
    try {
    } catch (error: any) {
      toast.error(error.response?.data.err || error.message)
    }
  }
  useEffect(() => {
    return () => {
      socket.emit("disconnected")
    }
  }, [])
  return (
    <div className=" h-screen pt-16 p-8 flex items-center justify-between gap-8 bg-primary">
      <ChatAside conversations={conversations} />
      <ChatBody />
      <ChatProfile />
    </div>
  )
}
