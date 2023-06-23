import React, { useEffect, useState } from "react"
import { ChatAside } from "../components/ChatAside"
import { ChatProfile } from "../components/ChatProfile"
import io from "socket.io-client"
import { toast } from "react-hot-toast"
import { useAuth } from "../hooks/useAuth"
import { Outlet } from "react-router-dom"

export const Messages: React.FC = () => {
  const { accessToken } = useAuth()?.user!

  const socket = io("http://localhost:5005")

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
      <ChatAside />
      <Outlet />
      <ChatProfile />
    </div>
  )
}
