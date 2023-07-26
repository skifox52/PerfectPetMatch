import React from "react"
import { useAuth } from "../hooks/useAuth"

interface SingleChatBodyProps {
  el: any
}

export const SingleChatBody: React.FC<SingleChatBodyProps> = ({ el }) => {
  const { _id, accessToken } = useAuth()!.user!
  return (
    <div
      className={
        JSON.parse(el).sender === _id
          ? "chat chat-end flex flex-col"
          : "chat chat-start flex flex-col"
      }
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
          (new Date(parseInt(JSON.parse(el).timeStamps)).getMinutes().toString()
            .length === 1
            ? "0" + new Date(parseInt(JSON.parse(el).timeStamps)).getMinutes()
            : new Date(parseInt(JSON.parse(el).timeStamps)).getMinutes())}
      </span>
    </div>
  )
}
