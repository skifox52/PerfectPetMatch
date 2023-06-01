import React, { useContext, useEffect, useState } from "react"
import Lottie from "lottie-react"
import { Link, useNavigate } from "react-router-dom"
import animationData from "../assets/animations/29280-sleepy-cat.json"
import { FcGoogle } from "react-icons/fc"
import getGoogleUrl from "../utils/getGoogleUrl"
import { toast } from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import { loginUser, resetPassword } from "../api/userApi"
import { UserContext } from "../contexts/userContext"

export interface UserInputInterface {
  mail: string
  password: string
}

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const [userLoginData, setUserLoginData] = useState<UserInputInterface>({
    mail: "",
    password: "",
  })
  //Handle onChange
  const handleOnChance: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setUserLoginData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }))
  }
  //handle user mutation
  let [loadingToast, setLoadingToast] = useState<any>(null)
  //User context
  const userContext = useContext(UserContext)
  const createUserMutation = useMutation({
    mutationFn: (variables: UserInputInterface) => loginUser(variables),
    onSuccess: (data) => {
      userContext?.setUser(data)
      localStorage.setItem("User", JSON.stringify(data))
    },
    onError: (error: any) => {
      toast.error(error.response?.data.err || error.message)
    },
  })
  //Handeling loading state
  useEffect(() => {
    if (createUserMutation.isLoading) {
      setLoadingToast(toast.loading("Connexion..."))
    } else {
      setLoadingToast(null)
      toast.dismiss(loadingToast)
    }
    createUserMutation.isSuccess && navigate("/")
  }, [createUserMutation.isLoading, createUserMutation.isSuccess])
  //handle login onSubmit
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!userLoginData.mail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return toast.error("Adresse mail incorrect!")
    }
    createUserMutation.mutate(userLoginData)
  }
  //Handle reset
  //--Handle reset State
  const [resetInput, setResetInput] = useState<string>("")
  const [resetIsLoading, setResetIsLoading] = useState<any>(null)
  //--Handle onSubmit mutation
  const createResetPasswordMutation = useMutation({
    mutationFn: (variables: string) => resetPassword(variables),
    onSuccess: (data, vairables) => {
      data.success && toast.success("Un email a été envoyer a : " + vairables)
      setResetInput("")
    },
    onError: (error: any) => {
      toast.error(error.response?.data.err || error.message)
    },
  })
  //--Handle reset onSubmit
  const handleResetOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!resetInput.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return toast.error("Adresse mail incorrect!")
    }
    createResetPasswordMutation.mutate(resetInput)
  }
  useEffect(() => {
    if (createResetPasswordMutation.isLoading) {
      setResetIsLoading(toast.loading("E-mail en cours d'envoie..."))
    } else {
      setResetIsLoading(null)
      toast.dismiss(resetIsLoading)
    }
  }, [createResetPasswordMutation.isLoading])
  return (
    <div className="overflow-hidden w-screen py-4 min-h-screen flex flex-col md:flex-row md:justify-between items-center justify-evenly">
      <Lottie
        animationData={animationData}
        className="md:max-w-1/2 md:w-1/2 h-1/2 md:h-full"
      />
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center">
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col w-4/5 sm:w-2/3 gap-4 items-start md:w-2/3 lg:w-1/2"
        >
          <h1 className="hidden md:block md:mb-8 md:w-2/3 md:text-6xl lg:text-7xl xl:text-8xl md:font-black md:text-primary">
            Perfect pet match
          </h1>
          <input
            type="email"
            required
            placeholder="Email..."
            name="mail"
            onChange={handleOnChance}
            className="input input-bordered input-primary w-full lg:text-[18px]"
          />
          <input
            type="password"
            required
            placeholder="Password..."
            name="password"
            onChange={handleOnChance}
            className="input input-bordered input-primary w-full lg:text-[18px]"
          />
          <button
            type="submit"
            className="btn btn-primary w-full font-bold text-white"
            disabled={createUserMutation.isLoading}
          >
            {createUserMutation.isLoading ? "Loading..." : "Connexion"}
          </button>
          <a
            href={getGoogleUrl()}
            className="flex items-center justify-center gap-4 btn btn-primary h-fit w-full font-bold text-white text-xs lg:text-[13px] xl:text-[16px]"
          >
            <FcGoogle className="text-lg lg:text-2xl" /> Continuer avec Google
          </a>
        </form>
        <div className="flex flex-col w-4/5 sm:w-2/3 py-4 items-end md:w-2/3 lg:w-1/2">
          <Link
            to={"/register"}
            className="hover:text-gray-400 text-primary underline"
          >
            Créer un compte ?
          </Link>
          {/* Mot de passe oublier section  */}
          <label
            htmlFor="my-modal-4"
            className="hover:text-gray-400 text-primary underline cursor-pointer"
          >
            Mot de passe oublier?
          </label>

          <input type="checkbox" id="my-modal-4" className="modal-toggle" />
          <label htmlFor="my-modal-4" className="modal cursor-pointer">
            <label className="modal-box relative" htmlFor="">
              <h3 className="text-lg font-bold">Insérez votre E-mail</h3>
              <form
                className="py-4  flex flex-col gap-4"
                onSubmit={handleResetOnSubmit}
              >
                <input
                  type="email"
                  name="resetMail"
                  className="input input-primary"
                  value={resetInput}
                  required
                  placeholder="E-mail..."
                  onChange={(e) => setResetInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary text-gray-50">
                  Envoyer
                </button>
              </form>
            </label>
          </label>
        </div>
      </div>
    </div>
  )
}
