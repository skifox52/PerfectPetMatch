import React, { useEffect, useState, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchNotifications,
  markNotificationsAsSeen,
} from "../api/notificationApi"
import { useAuth } from "../hooks/useAuth"
import { toast } from "react-hot-toast"
import { MdNotificationsNone } from "react-icons/md"
import { Link } from "react-router-dom"
import { NotificationType } from "../types/notificationType"

interface NotificationProps {}

export const Notification: React.FC<NotificationProps> = ({}) => {
  const [message, setMessage] = useState<NotificationType[]>([])
  const queryClient = useQueryClient()
  const notificationRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState<number>(0)
  const accessToken: string = useAuth()?.user?.accessToken as string
  const currentUserId: string = useAuth()?.user?._id as string
  const [showNotifications, setShowNotifications] = useState<boolean>(false)
  //WebSocket configuration
  const webSocket = new WebSocket("ws://localhost:5052")
  useEffect(() => {
    webSocket.addEventListener("message", (ev: MessageEvent<string>) => {
      if (
        JSON.parse(ev.data).owner === currentUserId &&
        JSON.parse(ev.data).user._id !== currentUserId
      ) {
        setCount((prev) => prev + 1)
      }
      setMessage((prev) => [JSON.parse(ev.data), ...prev])
    })
    return () => webSocket.close()
  }, [webSocket])
  //Fetch notifications
  const { data, isError, isSuccess, error, isLoading, isFetching } = useQuery<
    NotificationType[],
    any,
    NotificationType[]
  >({
    queryKey: ["notifications", accessToken],
    queryFn: () => fetchNotifications(accessToken),
  })
  useEffect(() => {
    if (isError) toast.error(error.reponse?.date?.err || error.message)
    if (isSuccess) {
      setMessage(data)
      setCount(data.filter((d) => d.isSeen === false).length)
    }
  }, [isSuccess, isError, isFetching])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])
  //Mark notifications as seen
  const markNotifcationsAsSeenMutation = useMutation<
    { success: boolean; message: string },
    any,
    { token: string }
  >({
    mutationFn: (varaibles: { token: string }) =>
      markNotificationsAsSeen(varaibles.token),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", accessToken])
    },
    onError: (error) => toast.error(error.response?.data?.err || error.message),
  })
  return (
    <li className="p-0">
      <button
        className="w-full h-full flex items-center gap-8 rounded-xl"
        disabled={isLoading}
        onClick={(e) => {
          e.stopPropagation()
          setShowNotifications((prev) => !prev)
          markNotifcationsAsSeenMutation.mutate({ token: accessToken })
        }}
      >
        <MdNotificationsNone className="text-2xl text-gray-600" />
        Notifications{" "}
        {count > 0 && (
          <span className="text-gray-50 bg-error h-6 flex items-center justify-center aspect-square rounded-full">
            {count}
          </span>
        )}
      </button>
      {showNotifications && (
        <section
          ref={notificationRef}
          className="absolute right-0 cursor-default translate-x-[105%] max-h-96 overflow-y-auto flex flex-col gap-4 rounded-lg p-4  bg-white shadow-lg border border-r-gray-300 top-0"
        >
          {message.length > 0
            ? message.map((msg, i: number) => (
                <Link
                  to={`post/${msg.post}`}
                  key={i}
                  className="bg-bgPrimary z-50 py-2 px-3 w-full rounded-md flex border border-gray-200 items-center gap-4"
                >
                  <img
                    className="w-10 rounded-full"
                    src={
                      !!msg.user.googleID
                        ? msg.user.image
                        : `${import.meta.env.VITE_MEDIA_SERVICE}${
                            msg.user.image
                          }`
                    }
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-accent">
                      {`${msg.user.nom} ${msg.user.prenom}`}
                    </span>
                    <span className="font-normal">{` a ${
                      msg.type === "like" ? "aimer" : "commenter"
                    } votre publication`}</span>
                    <span className="font-normal text-sm text-gray-400">
                      {Math.floor((Date.now() - msg.timeStamps) / 1000 / 60) ==
                      0
                        ? "A l'instant."
                        : (Date.now() - msg.timeStamps) / 1000 / 60 < 60
                        ? ` Il y'a ${Math.floor(
                            (Date.now() - msg.timeStamps) / 1000 / 60
                          )} minutes.`
                        : Math.floor(
                            (Date.now() - msg.timeStamps) / 1000 / 60
                          ) > 60 &&
                          Math.floor(
                            (Date.now() - msg.timeStamps) / 1000 / 60
                          ) < 1440
                        ? ` Il y'a ${Math.floor(
                            (Date.now() - msg.timeStamps) / 1000 / 60 / 60
                          )} heures.`
                        : `Il y'a ${Math.floor(
                            (Date.now() - msg.timeStamps) / 1000 / 60 / 60 / 24
                          )} jours.`}
                    </span>
                  </div>
                </Link>
              ))
            : "Pas de notifications"}
        </section>
      )}
    </li>
  )
}
