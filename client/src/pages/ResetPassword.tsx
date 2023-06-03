import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { isResetKeyValide, updatePassword } from "../api/userApi"
import { LoadingDog } from "../components/LoadingDog"
import Lottie from "lottie-react"
import animationData from "../assets/animations/pet-reset-password.json"
import { toast } from "react-hot-toast"

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loadingToast, setLoadingToast] = useState<any>(null)
  const [resetData, setResetData] = useState<string>("")
  const location = useLocation()
  const navigate = useNavigate()
  //mutation for validating the key
  const createIsValidKey = useMutation({
    mutationFn: (variables: string) => isResetKeyValide(variables),
    onSuccess: (data) => {
      if (data.exist) {
        setResetData(data.mail!)
      } else {
        throw new Error("Invalide key!")
      }
    },
    onError: (error: any) => {
      toast.error(error!.response?.data.err || error!.message!, {
        duration: 2000,
      })
      navigate("/login")
    },
  })
  const queryParams: URLSearchParams = new URLSearchParams(location.search)
  useEffect(() => {
    if (queryParams.get("key")) {
      createIsValidKey.mutate(queryParams.get("key") as string)
    } else {
      navigate("/login")
    }
  }, [])
  //Mutation for updating the password
  const createUpdatePasswordMutation = useMutation({
    mutationFn: (variables: { mail: string; password: string }) =>
      updatePassword(variables.mail, variables.password),
    onSuccess: (data) => {
      toast.success(data)
      navigate("/login")
    },
    onError: (error: any) => {
      toast.error(error.response?.data.err || error.message)
    },
  })
  //Handle Onsubmit
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return toast.error("Vérifiez vos mot de passes!")
    }
    if (password.length < 8) {
      return toast.error("Mot de passe trop court!")
    }
    createUpdatePasswordMutation.mutate({ mail: resetData, password: password })
  }
  useEffect(() => {
    if (createUpdatePasswordMutation.isLoading) {
      setLoadingToast(toast.loading("Loading..."))
    } else {
      setLoadingToast(null)
      toast.dismiss(loadingToast)
    }
  }, [createUpdatePasswordMutation.isLoading])
  if (createIsValidKey.isLoading) return <LoadingDog />
  return (
    <div className="flex flex-col sm:flex-row justify-between h-screen  w-screen bg-primary">
      <div className="flex h-1/5 sm:h-full sm:w-1/2 items-center justify-center bg-primary">
        <Lottie animationData={animationData} className="h-full" />
      </div>
      <section className="w-full  lg:w-1/2 gap-8 bg-base-100 h-full p-8 md:py-16 md:px-4 lg:py-32  flex flex-col items-center md:gap-16">
        <div className="w-full md:w-2/3 flex flex-col gap-3">
          <h1 className="font-black text-3xl text-primary">
            Réinitialisation du mot de passe
          </h1>
          <h2 className="font-bold text-2xl">Bonjour "{resetData}"</h2>
          <h2 className="font-semibold">Tapez votre nouveau mot de passe</h2>
        </div>
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col items-center gap-3 my-8 w-full md:w-2/3"
        >
          <input
            type="password"
            required
            value={password}
            placeholder="New password..."
            onChange={(e) => setPassword(e.target.value)}
            className="input input-primary w-full"
            disabled={createUpdatePasswordMutation.isLoading}
          />
          <input
            type="password"
            value={confirmPassword}
            required
            placeholder="Confirm password..."
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input input-primary w-full"
            disabled={createUpdatePasswordMutation.isLoading}
          />
          <button
            type="submit"
            disabled={createUpdatePasswordMutation.isLoading}
            className="btn btn-primary text-white font-semibold w-full"
          >
            {createUpdatePasswordMutation.isLoading
              ? "Chargement!"
              : "Confirmer"}
          </button>
        </form>
      </section>
    </div>
  )
}
