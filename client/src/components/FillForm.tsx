import React, { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UserType, findById, updateGoogleUser } from "../api/userApi"
import { LoadingDog } from "../components/LoadingDog"
import Lottie from "lottie-react"
import animationData from "../assets/animations/43901-cute-dog.json"
import { toast } from "react-hot-toast"
import { UserContext } from "../contexts/userContext"
import wilayas from "../data/wilayas.json"

export const FillForm: React.FC = () => {
  const [loadingToast, setLoadingToast] = useState<any>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const userContext = useContext(UserContext)
  //Get query params
  const searchParams = new URLSearchParams(location.search)
  const _id: string = searchParams.get("_id")!
  const accessToken: string | null = searchParams.get("accessToken")
  const refreshToken: string | null = searchParams.get("refreshToken")

  //mutation for validating the key
  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
  }: { error: any; data: any; isError: any; isLoading: any; isSuccess: any } =
    useQuery({
      queryKey: ["User", _id],
      queryFn: () => findById(_id as string),
    })
  //User form input
  const [userData, setUserData] = useState<any>({
    nom: "",
    prenom: "",
    adresse: "",
    sexe: "",
    date_de_naissance: "",
    ville: "",
  })
  const onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    setUserData((previous: any) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }))
  }

  //OnMount
  useEffect(() => {
    if (!_id || !accessToken || !refreshToken) {
      toast.error("Veuillez réesseyer!")
      navigate("/login")
    } else {
      if (isError) {
        toast.error(error.response?.data.err || error.message)
        navigate("/login")
      }
      if (isSuccess) {
        console.log(data.ville)
        if (data.ville) {
          console.log(data)
          userContext?.setUser({
            _id,
            accessToken,
            refreshToken,
            role: data.role,
          })
          localStorage.setItem(
            "User",
            JSON.stringify({ _id, role: data.role, accessToken, refreshToken })
          )
          navigate("/")
        } else {
          setUserData({
            nom: data.nom || "",
            prenom: data.prenom || "",
            adresse: data.adress || "",
            sexe: data.sexe || "",
            date_de_naissance: "",
            ville: data.ville || "",
          })
        }
      }
    }
  }, [])
  //HandleOnSubmit
  //--create user mutation
  const createUpdateGoogleUserMutation = useMutation({
    mutationFn: (variables: { id: string; data: UserType }) => {
      return updateGoogleUser(variables.id, variables.data)
    },
    onSuccess: (data) => {
      userContext?.setUser({
        _id: data._id,
        role: data.role,
        accessToken: accessToken as string,
        refreshToken: refreshToken as string,
      })
      localStorage.setItem(
        "User",
        JSON.stringify({
          _id: data._id,
          role: data.role,
          accessToken,
          refreshToken,
        })
      )
    },
    onError: (error: any) => {
      toast.error(error.response.data.err || error.message)
    },
  })
  useEffect(() => {
    if (createUpdateGoogleUserMutation.isLoading) {
      setLoadingToast(toast.loading("Connexion..."))
    } else {
      setLoadingToast(null)
      toast.dismiss(loadingToast)
    }
    createUpdateGoogleUserMutation.isSuccess && navigate("/")
  }, [
    createUpdateGoogleUserMutation.isLoading,
    createUpdateGoogleUserMutation.isSuccess,
  ])
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    createUpdateGoogleUserMutation.mutate({ id: _id, data: userData })
  }
  if (isLoading) return <LoadingDog />
  return (
    <div className="flex flex-col sm:flex-row justify-between h-screen overflow-x-hidden  w-screen bg-primary">
      <div className="flex h-1/5 sm:h-full sm:w-1/2 items-center justify-center bg-primary">
        <Lottie animationData={animationData} className="h-full" />
      </div>
      <section className="w-full  lg:w-1/2 gap-8 bg-base-100 h-full p-8 md:py-8 md:px-4 lg:py-16  flex flex-col items-center md:gap-16">
        <div className="w-full md:w-2/3 flex flex-col gap-3">
          <h1 className="font-black text-xl md:text-3xl text-primary">
            Bonjour "{data.nom || data.mail}"
          </h1>
          <h2 className="font-semibold text-xs md:text-base">
            Vous devez remplir quelque informations supplémentaires pour
            continuer
          </h2>
        </div>
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col items-center  my-2 sm:my-8 w-full md:w-2/3"
        >
          <div className="form-control gap-1 w-full">
            <label htmlFor="nom" className=" text-gray-600 text-xs">
              Nom
            </label>
            <input
              type="text"
              required
              id="nom"
              value={userData.nom}
              placeholder="Nom..."
              name="nom"
              onChange={onChange}
              className="input input-sm sm:input-md input-primary w-full"
            />
          </div>
          <div className=" form-control gap-1 w-full">
            <label htmlFor="prenom" className=" text-gray-600 text-xs">
              Prénom
            </label>
            <input
              type="text"
              value={userData.prenom}
              required
              name="prenom"
              id="prenom"
              placeholder="Prenom..."
              onChange={onChange}
              className="input input-sm sm:input-md input-primary w-full"
            />
          </div>
          <div className=" form-control gap-1 w-full">
            <label htmlFor="prenom" className=" text-gray-600 text-xs">
              Adresse
            </label>
            <input
              type="text"
              value={userData.adresse}
              required
              name="adresse"
              placeholder="Adresse..."
              onChange={onChange}
              className="input input-sm sm:input-md input-primary w-full"
            />
          </div>
          <div className=" form-control gap-1 w-full">
            <label htmlFor="prenom" className=" text-gray-600 text-xs">
              Date de naissance
            </label>
            <input
              type="date"
              value={userData.date_de_naissance}
              required
              name="date_de_naissance"
              placeholder="Date de naisssance..."
              onChange={onChange}
              className="input input-sm sm:input-md input-primary w-full"
            />
          </div>
          <div className=" form-control gap-1 w-full">
            <label htmlFor="prenom" className=" text-gray-600 text-xs">
              Sexe
            </label>
            <select
              className="select select-sm sm:select-md select-primary w-full"
              name="sexe"
              onChange={onChange}
              required
              defaultValue={""}
            >
              <option disabled hidden value={""}>
                Sexe
              </option>
              <option>Homme</option>
              <option>Femme</option>
            </select>
          </div>
          <div className=" form-control gap-1 w-full">
            <label htmlFor="prenom" className=" text-gray-600 text-xs ">
              Ville
            </label>
            <select
              className="select select-sm sm:select-md  select-primary w-full"
              name="ville"
              onChange={onChange}
              required
              defaultValue={""}
            >
              <option disabled hidden value={""}>
                Ville
              </option>
              {wilayas.map((wilaya) => (
                <option key={wilaya.id} value={wilaya.nom}>
                  {wilaya.code} - {wilaya.nom}
                </option>
              ))}
            </select>
          </div>
          <div className=" form-control w-full">
            <button
              type="submit"
              disabled={createUpdateGoogleUserMutation.isLoading}
              className="btn btn-primary btn-sm sm:btn-md text-white font-semibold w-full my-4"
            >
              {createUpdateGoogleUserMutation.isLoading
                ? "Chargement!"
                : "Continuer"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
