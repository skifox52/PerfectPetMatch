import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import React from "react"
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom"
import { Layout } from "./Layout/Layout"
import { Toaster } from "react-hot-toast"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    )
  )
  return (
    <React.Fragment>
      <RouterProvider router={router} />
      <Toaster />
    </React.Fragment>
  )
}

export default App
