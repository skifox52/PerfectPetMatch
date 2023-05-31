import React from "react"
import { useLocation } from "react-router-dom"

export const ResetPassword: React.FC = () => {
  const location = useLocation()
  const queryParams: string[] = decodeURIComponent(location.search).split("=")
  if (queryParams[0] === "?key" && queryParams[1]) {
    console.log(queryParams[1])
  } else {
    console.log("nope")
  }
  return (
    <div>
      <h1>Hello world</h1>
    </div>
  )
}
