import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { findById, isResetKeyValide, updatePassword } from "../api/userApi"
import { LoadingDog } from "../components/LoadingDog"
import Lottie from "lottie-react"
import animationData from "../assets/animations/43901-cute-dog.json"
import { toast } from "react-hot-toast"

export const FillForm: React.FC = () => {
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loadingToast, setLoadingToast] = useState<any>(null)
  const [resetData, setResetData] = useState<string>("")
  const location = useLocation()
  const navigate = useNavigate()
  //mutation for validating the key
  console.log(decodeURIComponent(location.search))
  //   const createIsUserQuery = useQuery({
  //     queryKey: ["User", _id],
  //     queryFn: () => findById(_id),
  //   })

  //   if (createIsUserQuery.isLoading) return <LoadingDog />
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
        <form className="flex flex-col items-center gap-3 my-8 w-full md:w-2/3">
          <input
            type="password"
            required
            value={password}
            placeholder="New password..."
            onChange={(e) => setPassword(e.target.value)}
            className="input input-primary w-full"
          />
          <input
            type="password"
            value={confirmPassword}
            required
            placeholder="Confirm password..."
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input input-primary w-full"
          />
          {/* <button
            type="submit"
            disabled={createUpdatePasswordMutation.isLoading}
            className="btn btn-primary text-white font-semibold w-full"
          >
            {createUpdatePasswordMutation.isLoading
              ? "Chargement!"
              : "Confirmer"}
          </button> */}
        </form>
      </section>
    </div>
  )
}
