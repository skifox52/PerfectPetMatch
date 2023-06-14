import { useAuth } from "./useAuth"
import { useLocation, Outlet, Navigate } from "react-router-dom"
import React, { PropsWithChildren } from "react"

interface protectRoutesProps extends PropsWithChildren {
  allowedRole: string
}

export const ProtectRoutes: React.FC<protectRoutesProps> = ({
  allowedRole,
}) => {
  const location = useLocation()
  const userContext = useAuth()
  return userContext?.user && userContext.user.role === allowedRole ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  )
}
