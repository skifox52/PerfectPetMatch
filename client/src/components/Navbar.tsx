import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useMutation } from "@tanstack/react-query"
import { logoutUser } from "../api/userApi"
import { toast } from "react-hot-toast"

export const Navbar: React.FC = ({}) => {
  const [loadingToast, setLoadingToast] = useState<any>(null)
  const logoutMutation = useMutation({
    mutationFn: (variables: { refreshToken: string; token: string }) =>
      logoutUser(variables.refreshToken, variables.token),
    onSuccess: (data) => data.success && toast.success(data.message),
    onError: (error: any) =>
      toast.error(error.response?.data.err || error.message),
  })
  const userContext = useAuth()
  const navigate = useNavigate()
  const disconnect = (): void => {
    logoutMutation.mutate({
      refreshToken: userContext?.user?.refreshToken as string,
      token: userContext?.user?.accessToken as string,
    })
  }
  useEffect(() => {
    if (logoutMutation.isLoading) {
      setLoadingToast(toast.loading("Loading..."))
    } else {
      setLoadingToast(null)
      toast.dismiss(loadingToast)
    }
    if (logoutMutation.isSuccess) {
      localStorage.removeItem("User")
      userContext?.setUser(null)
      navigate("/login")
    }
  }, [logoutMutation.isLoading, logoutMutation.isSuccess])
  return (
    <div className="navbar bg-bgPrimary flex justify-between z-50  w-full">
      <div>
        <NavLink to={"/"} className="btn btn-ghost  normal-case text-md">
          <img src="/PPT.png" alt="logo" className="h-full" />
        </NavLink>
      </div>
      <div>
        <ul className="flex  lg:menu-horizontal gap-12 text-gray-600 text-sm font-semibold tracking-wide">
          <li>
            <NavLink
              to={"/"}
              className="hover:text-black aria-[current=page]:underline aria-[current=page]:text-neutral "
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/market"}
              className="hover:text-black aria-[current=page]:underline aria-[current=page]:text-neutral "
            >
              Market
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/pets"}
              className="hover:text-black aria-[current=page]:underline aria-[current=page]:text-neutral "
            >
              Pets
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/about"}
              className="hover:text-black aria-[current=page]:underline aria-[current=page]:text-neutral "
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/contact"}
              className="hover:text-black aria-[current=page]:underline aria-[current=page]:text-neutral "
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src={userContext?.user?.profilePicture}
                className="object-cover object-center"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 font-semibold"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Pramètres</a>
            </li>
            <li>
              <button onClick={disconnect}>Déconnexion</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
