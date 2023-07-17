import React from "react"
import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { useLocation } from "react-router-dom"

export const Layout: React.FC = () => {
  const loaction = useLocation()
  return (
    <div className="min-h-screen min-w-screen">
      {location.pathname !== "/login" &&
        location.pathname !== "/register" &&
        location.pathname !== "/google-fill-form" &&
        location.pathname !== "/resetPassword" && (
          <header>
            <Navbar />
          </header>
        )}
      <main className="font-montserrat bg-bgPrimary">
        <Outlet />
      </main>
    </div>
  )
}
