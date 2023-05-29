import React, { useContext, useEffect, useState } from "react"
import Lottie from "lottie-react"
import { Link, useNavigate } from "react-router-dom"
import animationData from "../assets/animations/29280-sleepy-cat.json"
import { FcGoogle } from "react-icons/fc"
import getGoogleUrl from "../utils/getGoogleUrl"
import { toast } from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../api/userApi"
import type { CustomErrorObject } from "../types/customError"
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
  const userContext = useContext(UserContext)
  const createUserMutation = useMutation({
    mutationFn: (variables: UserInputInterface) => loginUser(variables),
    onSuccess: (data) => {
      userContext?.setUser(data)
      localStorage.setItem("User", JSON.stringify(data))
      navigate("/")
    },
    onError: (error: any) => {
      toast.error(error.response.data.err ?? error.message)
    },
    onSettled: () => {
      loadingToast && toast.dismiss(loadingToast)
    },
  })
  //Handeling loading state
  useEffect(() => {
    if (createUserMutation.isLoading) {
      setLoadingToast(toast.loading("Logging in..."))
    }
  }, [createUserMutation.isLoading])

  //handle OnSubmit
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    // if (!userLoginData.mail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    //   return toast.error("Adresse mail incorrect!")
    // }
    createUserMutation.mutate(userLoginData)
  }
  return (
    <div className="overflow-hidden w-screen h-screen flex flex-col md:flex-row md:justify-between items-center justify-evenly">
      <Lottie
        animationData={animationData}
        className="md:max-w-1/2 md:w-1/2 h-1/2 md:h-full"
      />
      <div className="w-full md:w-1/2 h-full flex justify-center items-center">
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col w-4/5 sm:w-2/3 gap-4 items-start md:w-2/3 lg:w-1/2"
        >
          <h1 className="hidden md:block md:mb-8 md:w-2/3 md:text-6xl lg:text-7xl xl:text-8xl md:font-black md:text-primary">
            Perfect pet match
          </h1>
          <input
            type="mail"
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
          <div className="w-full flex justify-end">
            <Link
              to={"/register"}
              className="hover:text-gray-600 text-primary underline"
            >
              Créer un compte ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
