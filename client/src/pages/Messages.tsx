import React, { useEffect, useState } from "react"
import { ChatAside } from "../components/ChatAside"
import { ChatProfile } from "../components/ChatProfile"
import io from "socket.io-client"
import { Outlet } from "react-router-dom"
import chatBackground from "../assets/pictures/chatBackground.png"

export const Messages: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{
    nom: string
    prenom: string
    image: string
    sexe: string
    adresse: string
    date_de_naissance: string
    googleID?: string
    _id: string
  } | null>(null)
  //Initialize the socker object
  const socket = io("http://localhost:5005")
  useEffect(() => {
    return () => {
      socket.emit("disconnected")
    }
  }, [])
  return (
    <div
      className="min-h-[92.5vh] pt-8 p-8 flex flex-col lg:flex-row items-center justify-between  gap-4 bg-center bg-cover"
      style={{
        backgroundImage: `url(${chatBackground})`,
      }}
    >
      <ChatAside socket={socket} setCurrentUser={setCurrentUser} />
      <Outlet context={socket} />
      {/* <ChatProfile currentUser={currentUser} /> */}
    </div>
  )
}
