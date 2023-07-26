import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { fetchCurrentUser, fetchUserById } from "../api/userApi"
import { useAuth } from "../hooks/useAuth"
import { LoadingDog } from "../components/LoadingDog"
import { toast } from "react-hot-toast"
import { singleUserInterface } from "../types/userType"
import banner from "../assets/pictures/7486972.jpg"
import { useParams } from "react-router-dom"

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
  const currentUserId = useAuth()?.user?._id
  const accessToken = useAuth()?.user?.accessToken
  const { id } = useParams()
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<singleUserInterface, any>({
    queryKey: ["profile", id, accessToken],
    queryFn: () => fetchUserById(id as string, accessToken as string),
  })
  useEffect(() => {
    if (isError) toast.error(error.response.data.err || error?.message)
  }, [isError])
  if (isLoading) return <LoadingDog />
  return (
    <div className="min-h-[92.5vh]">
      <div className="h-[15vw] w-full relative shadow-lg">
        <img
          src={banner}
          alt="banner"
          className="h-full object-center object-cover w-full"
        />
        <img
          src={
            user?.googleID
              ? user?.image
              : `${import.meta.env.VITE_MEDIA_SERVICE}`
          }
          className="absolute w-10 md:w-20 lg:w-40 bottom-1/2 left-[20%] -translate-x-1/2 rounded-2xl translate-y-1/2"
          alt="profile picture"
        />
      </div>
      <div className="relative flex  justify-center">
        <article className="bg-white p-8 w-full md:w-2/3 lg:w-1/3 mt-12 rounded-xl border border-gray-200 shadow-lg">
          <div className="flex justify-between border-b border-b-gray-200 p-4">
            <span className="font-semibold text-xl">Nom</span>
            <h3>{user?.nom}</h3>
          </div>
          <div className="flex justify-between border-b border-b-gray-200 p-4">
            <span className="font-semibold text-xl">Prénom</span>
            <h3>{user?.prenom}</h3>
          </div>
          <div className="flex justify-between border-b border-b-gray-200 p-4">
            <span className="font-semibold text-xl">Sexe</span>
            <h3>{user?.sexe}</h3>
          </div>
          <div className="flex justify-between border-b border-b-gray-200 p-4">
            <span className="font-semibold text-xl">Age</span>
            <h3>{user?.age}</h3>
          </div>
          <div className="flex justify-between border-b border-b-gray-200 p-4">
            <span className="font-semibold text-xl">Adresse</span>
            <h3>{user?.adresse}</h3>
          </div>
          <div className="flex justify-between border-b border-b-gray-200 p-4">
            <span className="font-semibold text-xl">Mail</span>
            <h3>{user?.mail}</h3>
          </div>
          <div className="flex justify-between   p-4">
            <span className="font-semibold text-xl">Ville</span>
            <h3>{user?.ville}</h3>
          </div>
        </article>
      </div>
    </div>
  )
}
