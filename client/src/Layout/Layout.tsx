import React from "react"
import { Outlet } from "react-router-dom"

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen min-w-screen">
      <Outlet />
    </div>
  )
}
