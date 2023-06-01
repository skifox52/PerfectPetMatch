import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { isResetKeyValide } from "../api/userApi"
import { LoadingDog } from "../components/LoadingDog"
import Lottie from "lottie-react"
import animationData from "../assets/animations/pet-reset-password.json"
import { toast } from "react-hot-toast"

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [resetData, setResetData] = useState<string>("")
  const location = useLocation()
  const navigate = useNavigate()
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
  const queryParams: string[] = decodeURIComponent(location.search).split("=")
  useEffect(() => {
    if (queryParams[0] === "?key" && queryParams[1]) {
      createIsValidKey.mutate(queryParams[1])
    } else {
      navigate("/login")
    }
  }, [])
  //Handle Onsubmit
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }
  if (createIsValidKey.isLoading) return <LoadingDog />
  return (
    <div className="flex justify-between h-screen w-screen">
      <div className="flex items-center justify-center bg-primary">
        <Lottie animationData={animationData} className="h-full" />
      </div>
      <section className="w-1/2 bg-base-100 h-full py-8 px-16">
        <h2 className="font-bold text-2xl">Bonjour "{resetData}"</h2>
        <h2 className="font-semibold">Tapez votre nouveau mot de passe</h2>
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col items-center gap-2 my-8"
        >
          <input
            type="password"
            required
            value={password}
            placeholder="New password..."
            onChange={(e) => setPassword(e.target.value)}
            className="input input-primary"
          />
          <input
            type="password"
            value={confirmPassword}
            required
            placeholder="Confirm password..."
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input input-primary"
          />
          <button
            type="submit"
            className="btn btn-primary text-white font-semibold"
          >
            Confirmer
          </button>
        </form>
      </section>
    </div>
  )
}
