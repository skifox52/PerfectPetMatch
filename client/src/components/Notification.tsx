import React, { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchNotifications } from "../api/notificationApi"
import { useAuth } from "../hooks/useAuth"
import { toast } from "react-hot-toast"

interface NotificationProps {}

export const Notification: React.FC<NotificationProps> = ({}) => {
  const [message, setMessage] = useState<string[]>([])
  const [count, setCount] = useState<number>(0)
  const accessToken = useAuth()?.user?.accessToken as string
  const [showNotifications, setShowNotifications] = useState<boolean>(false)
  //WebSocket configuration
  const webSocket = new WebSocket("ws://localhost:5052")
  useEffect(() => {
    webSocket.addEventListener("message", (ev: MessageEvent<string>) => {
      setCount((prev) => prev + 1)
      setMessage((prev) => [...prev, ev.data])
    })
    return () => webSocket.close()
  }, [webSocket])
  //Fetch notifications
  const { data, isError, isSuccess, error, isLoading } = useQuery<
    string[],
    any,
    string[]
  >({
    queryKey: ["notifications", accessToken],
    queryFn: () => fetchNotifications(accessToken),
  })
  useEffect(() => {
    if (isError) toast.error(error.reponse?.date?.err || error.message)
    if (isSuccess) {
      setMessage(data)
      setCount(data.length)
    }
  }, [isSuccess, isError])
  return (
    <div>
      <button
        className="btn btn-primary"
        disabled={isLoading}
        onClick={() => setShowNotifications((prev) => !prev)}
      >
        Norification {count > 0 && count}
      </button>
      {showNotifications && (
        <section>
          {message.length > 0
            ? message.map((msg: string, i: number) => (
                <div key={i}>{`${JSON.parse(msg).user} a ${
                  JSON.parse(msg).type === "like" ? "aimer" : "commenter"
                } votre publication`}</div>
              ))
            : "Pas de notifications"}
        </section>
      )}
    </div>
  )
}
