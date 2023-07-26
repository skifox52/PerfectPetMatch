import React, { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useMutation } from "@tanstack/react-query"
import { logoutUser } from "../api/userApi"
import { toast } from "react-hot-toast"

export const Navbar: React.FC = ({}) => {
  const [loadingToast, setLoadingToast] = useState<any>(null)
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)
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
    <div className="navbar bg-bgPrimary flex justify-between z-50 w-full">
      <div className="flex items-center">
        <NavLink to={"/"} className="btn btn-ghost normal-case text-md">
          <img src="/PPT.png" alt="logo" className="h-full" />
        </NavLink>
      </div>
      <div className="hidden md:block">
        <ul className="flex lg:menu-horizontal gap-12 text-gray-600 text-lg font-semibold tracking-wide">
          <li>
            <NavLink
              to={"/"}
              className="hover:text-black aria-[current=page]:text-accent aria-[current=page]:font-bold "
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/articles"}
              className="hover:text-black aria-[current=page]:text-accent aria-[current=page]:font-bold "
            >
              Articles
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/about"}
              className="hover:text-black aria-[current=page]:text-accent aria-[current=page]:font-bold "
            >
              À propos
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/contact"}
              className="hover:text-black aria-[current=page]:text-accent aria-[current=page]:font-bold "
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/messagerie"}
              className="hover:text-black aria-[current=page]:text-accent aria-[current=page]:font-bold "
            >
              Messagerie
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="flex items-center md:gap-2">
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
              <Link to="/settings" className="justify-between">
                Settings
              </Link>
            </li>
            <li>
              <button onClick={disconnect}>Déconnexion</button>
            </li>
          </ul>
        </div>
      </div>
      {/* Hamburger menu for mobile */}
      <div className="md:hidden flex items-center">
        <button
          className="text-2xl text-black focus:outline-none"
          onClick={() => setShowMobileMenu((prev) => !prev)}
        >
          ☰
        </button>
      </div>
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-14 z-50 right-0 left-0 border border-gray-200 shadow-lg bg-white p-4">
          <ul className="flex flex-col gap-4 text-gray-800 text-lg font-semibold tracking-wide">
            <li>
              <NavLink
                to={"/"}
                className="hover:text-black aria-[current=page]:text-accent aria-[current=page]:font-bold"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/articles"}
                className="hover:text-black aria-[current=page]:text-accent aria-[current=page]:font-bold"
                onClick={() => setShowMobileMenu(false)}
              >
                Articles
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/about"}
                className="hover:text-black aria-[current=page]:text-accent aria-[current=page]:font-bold"
                onClick={() => setShowMobileMenu(false)}
              >
                À propos
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/contact"}
                className="hover:text-black aria-[current=page]:text-accent aria-[current=page]:font-bold"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
