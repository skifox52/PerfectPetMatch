import React, { useState } from "react"
import { ChatAside } from "../components/ChatAside"
import { ChatBody } from "../components/ChatBody"
import { ChatProfile } from "../components/ChatProfile"

export const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<
    { _id: string; users: string[] }[]
  >([{ _id: "my conv", users: ["user1", "user2"] }])
  return (
    <div className=" h-screen pt-16 p-8 flex items-center justify-between gap-8 bg-primary">
      <ChatAside conversations={conversations} />
      <ChatBody />
      <ChatProfile />
    </div>
  )
}
