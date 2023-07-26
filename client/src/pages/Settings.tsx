import React, { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchCurrentUser, updateUser } from "../api/userApi"
import { singleUserInterface } from "../types/userType"
import toast from "react-hot-toast"
import { LoadingDog } from "../components/LoadingDog"
import banner from "../assets/pictures/7486972.jpg"
import wilayas from "../data/wilayas.json"

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}) => {
  const currentUserId = useAuth()?.user?._id
  const accessToken = useAuth()?.user?.accessToken
  const queryClient = useQueryClient()
  const { id } = useParams()
  const {
    data: user,
    isLoading,
    isError,
    error,
    isFetched,
  } = useQuery<singleUserInterface, any>({
    queryKey: ["profile", id, accessToken],
    queryFn: () => fetchCurrentUser(accessToken as string),
  })
  const [formData, setFormData] = useState<{
    nom: string
    prenom: string
    sexe: string
    adresse: string
    ville: string
  }>({
    nom: "",
    prenom: "",
    sexe: "",
    adresse: "",
    ville: "",
  })
  useEffect(() => {
    setFormData({
      nom: user?.nom!,
      prenom: user?.prenom!,
      sexe: user?.sexe!,
      adresse: user?.adresse!,
      ville: user?.ville!,
    })
  }, [isFetched])
  //Update user mutation
  const {
    mutate,
    isLoading: mutationLoading,
    isSuccess: mutationSuccess,
    isError: mutationIsError,
    error: mutationError,
  } = useMutation<any, any, any>(
    (variables: {
      formData: {
        nom: string
        prenom: string
        sexe: string
        adresse: string
        ville: string
      }
      token: string
    }) => updateUser(variables.formData, variables.token)
  )
  const handleOnChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    mutate({ formData, token: accessToken as string })
  }
  useEffect(() => {
    if (mutationSuccess) {
      queryClient.invalidateQueries(["profile", id, accessToken])
      toast.success("Updated successfully!")
    }
  }, [mutationSuccess])
  useEffect(() => {
    if (isError) toast.error(error.response.data.err || error?.message)
    if (mutationIsError)
      toast.error(mutationError.response.data.err || mutationError?.message)
  }, [isError, mutationIsError])
  if (isLoading) return <LoadingDog />
  return (
    <div className="min-h-[92.5vh]">
      <div className="h-[15vw] w-full relative shadow-lg">
        <img
          src={banner}
          alt="banner"
          className="h-full object-center object-cover w-full"
        />
      </div>
      <div className="relative flex  justify-center">
        {user?._id !== currentUserId && (
          <button className="absolute btn btn-primary btn-sm right-2 top-2 lg:right-8 text-gray-50 font-semibold lg:top-8">
            Contacter
          </button>
        )}

        <article className="bg-white p-8 w-full md:w-2/3 lg:w-1/3 mt-12 rounded-xl border border-gray-200 shadow-lg">
          {isFetched && (
            <form onSubmit={handleOnSubmit}>
              <div className="flex justify-between border-b border-b-gray-200 p-4">
                <span className="font-semibold text-xl">Nom</span>
                <input
                  type="text"
                  name="nom"
                  disabled={mutationLoading}
                  value={formData.nom}
                  onChange={handleOnChange}
                  className="input input-primary rounded-lg"
                />
              </div>
              <div className="flex justify-between border-b border-b-gray-200 p-4">
                <span className="font-semibold text-xl">Prénom</span>
                <input
                  type="text"
                  name="prenom"
                  disabled={mutationLoading}
                  value={formData.prenom}
                  onChange={handleOnChange}
                  className="input input-primary rounded-lg"
                />
              </div>
              <div className="flex justify-between border-b border-b-gray-200 p-4">
                <span className="font-semibold text-xl">Adresse</span>
                <input
                  type="text"
                  name="adresse"
                  disabled={mutationError}
                  value={formData.adresse}
                  onChange={handleOnChange}
                  className="input input-primary rounded-lg"
                />
              </div>

              <div className="flex justify-between border-b border-b-gray-200s  p-4">
                <span className="font-semibold text-xl">Ville</span>
                <select
                  name="ville"
                  disabled={mutationError}
                  value={formData.ville}
                  onChange={handleOnChange}
                  className="select select-primary rounded-lg"
                >
                  {wilayas.map((w) => (
                    <option value={w.nom} key={w.id}>
                      {w.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between p-4">
                <span className="font-semibold text-xl">Sexe</span>
                <select
                  name="sexe"
                  disabled={mutationError}
                  value={formData.sexe}
                  onChange={handleOnChange}
                  className="select select-primary rounded-lg"
                >
                  <option value="femme">Femme</option>
                  <option value="homme">Homme</option>
                </select>
              </div>
              <div className="btn btn-primary w-full text-gray-50 mt-3 rounded-lg">
                <button
                  type="submit"
                  disabled={mutationError}
                  className="font-semibold w-full text-xl"
                >
                  Modifier
                </button>
              </div>
            </form>
          )}
        </article>
      </div>
    </div>
  )
}
