import { useQuery } from "@tanstack/react-query"
import React from "react"
import { fetchCurrentUser } from "../api/userApi"
import { useAuth } from "../hooks/useAuth"
import { LoadingDog } from "../components/LoadingDog"
import { toast } from "react-hot-toast"
import { singleUserInterface } from "../types/user"

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
  const userAuth = useAuth()
  const { data, isLoading, isError, error } = useQuery<
    singleUserInterface,
    any
  >({
    queryKey: ["profile"],
    queryFn: () => fetchCurrentUser(userAuth?.user?.accessToken as string),
  })
  if (isError) toast.error(error.response.data.err || error?.message)
  if (isLoading) return <LoadingDog />
  return <div></div>
}
