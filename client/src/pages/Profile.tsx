import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { fetchCurrentUser } from "../api/userApi"
import { useAuth } from "../hooks/useAuth"
import { LoadingDog } from "../components/LoadingDog"
import { toast } from "react-hot-toast"
import { singleUserInterface } from "../types/userType"

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
  const [modifier, setModifier] = useState<boolean>(false)
  const userAuth = useAuth()
  const { data, isLoading, isError, error } = useQuery<
    singleUserInterface,
    any
  >({
    queryKey: ["profile"],
    queryFn: () => fetchCurrentUser(userAuth?.user?.accessToken as string),
  })
  useEffect(() => {
    if (isError) toast.error(error.response.data.err || error?.message)
  }, [isError])
  if (isLoading) return <LoadingDog />
  return <div className="min-h-[92.5vh]"></div>
}
