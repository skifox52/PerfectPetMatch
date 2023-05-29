import React, { useContext, useEffect, useState } from "react"
import Lottie from "lottie-react"
import animationData from "../assets/animations/95961-puppy-sleeping.json"
import { Link, useNavigate } from "react-router-dom"
import wilayas from "../data/wilayas.json"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { type UserType, registerUser } from "../api/userApi"
import { UserContext } from "../contexts/userContext"

export const Register: React.FC = ({}) => {
  const [loadingToast, setLoadingToast] = useState<any>(null)
  const navigate = useNavigate()
  //User context
  const userContext = useContext(UserContext)
  //User form data
  const [userFormData, setUserFormData] = useState<UserType>({
    nom: "",
    prenom: "",
    mail: "",
    date_de_naissance: null,
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
    adresse: "",
    sexe: "",
    image: "",
    ville: "",
  })
  //Handle form onChange function
  const handleOnChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    setUserFormData((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }))
  }
  //Handle User registration
  const createUserMutation = useMutation({
    mutationFn: (variables: Omit<UserType, "confirmer_mot_de_passe">) =>
      registerUser(variables),
    onSuccess: (data) => {
      userContext?.setUser(data)
      localStorage.setItem("User", JSON.stringify(data))
      navigate("/")
    },
    onError: (error: any) => {
      toast.error(error.message ?? error.response.data.err)
    },
    onSettled: () => {
      if (!!loadingToast) toast.dismiss(loadingToast)
    },
  })

  useEffect(() => {
    if (createUserMutation.isLoading) {
      setLoadingToast(toast.loading("Logging in..."))
    } else {
      setLoadingToast(null)
    }
  }, [createUserMutation.isLoading])
  //onSubmit function
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    //Handeling some exceptions
    // if (!userFormData.mail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    //   return toast.error("Adresse mail incorrect!")
    // }
    if (userFormData.mot_de_passe !== userFormData.confirmer_mot_de_passe) {
      return toast.error("Vérifiez vos mots de passe")
    }
    // if (userFormData.mot_de_passe.length < 8) {
    //   return toast.error("Mot de passe trop faible")
    // }
    const { confirmer_mot_de_passe, ...data } = userFormData
    createUserMutation.mutate(data)
  }

  return (
    <div className="w-screen min-h-screen flex overflow-x-hidden">
      <div className="h-full w-0 md:w-2/5 xl:w-1/2">
        <Lottie animationData={animationData} className="h-screen" />
      </div>
      <section className="flex-1 min-h-full bg-primary bg-opacity-70 flex justify-center items-center">
        <div className="relative md:4/5 lg:w-2/3 my-12">
          <div className=" inset-0 bg-primary z-0  absolute rotate-12"></div>
          <form
            onSubmit={onSubmit}
            className="w-full bg-base-100   relative z-1 bg-opacity-50 rounded-2xl p-4 lg:p-8 flex flex-col items-center gap-2 text-gray-700"
          >
            <input
              type="text"
              required
              placeholder="Nom..."
              name="nom"
              className="input input-bordered input-primary w-full"
              onChange={handleOnChange}
            />
            <input
              type="text"
              required
              placeholder="Prénom..."
              name="prenom"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <input
              type="mail"
              required
              placeholder="Email..."
              name="mail"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <input
              type="password"
              required
              placeholder="Password..."
              name="mot_de_passe"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <input
              type="password"
              required
              name="confirmer_mot_de_passe"
              onChange={handleOnChange}
              placeholder="Confirm password..."
              className="input input-bordered input-primary w-full"
            />
            <input
              type="text"
              required
              placeholder="Adresse..."
              name="adresse"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <select
              className="select select-primary w-full"
              name="sexe"
              onChange={handleOnChange}
              required
              defaultValue={""}
            >
              <option disabled hidden value={""}>
                Sexe
              </option>
              <option>Homme</option>
              <option>Femme</option>
            </select>
            <input
              type="date"
              required
              name="date_de_naissance"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <select
              className="select select-primary w-full"
              name="ville"
              onChange={handleOnChange}
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
            <input
              name="image"
              onChange={handleOnChange}
              type="file"
              className="file-input file-input-bordered file-input-primary w-full"
            />
            <button
              type="submit"
              disabled={createUserMutation.isLoading}
              className="btn btn-primary text-white w-full"
            >
              {createUserMutation.isLoading ? "Loading..." : "S'enregistrer"}
            </button>
            <div className="w-full flex justify-end">
              <Link
                to="/login"
                className="text-primary hover:text-black undelrines w-fit"
              >
                J'ai déjà un compte
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
