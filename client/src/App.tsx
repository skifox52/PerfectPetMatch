import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { useMemo, useState } from "react"
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom"
import { Layout } from "./Layout/Layout"
import { Toaster } from "react-hot-toast"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { UserContext, type UserContextType } from "./contexts/userContext"
import { Home } from "./pages/Home"
import { ResetPassword } from "./pages/ResetPassword"
import { NotFound } from "./components/NotFound"
import { FillForm } from "./components/FillForm"
import { ProtectRoutes } from "./hooks/ProtectRoutes"
import { Messages } from "./pages/Messages"
import { Profile } from "./pages/Profile"
import { ChatBody } from "./components/ChatBody"
import { ChatInbox } from "./components/ChatInbox"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-fill-form" element={<FillForm />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route element={<ProtectRoutes allowedRole="user" />}>
          <Route index element={<Home />} />
          <Route path="/messagerie" element={<Messages />}>
            <Route index element={<ChatInbox />} />
            <Route
              path="/messagerie/c/:conversationId"
              element={<ChatBody />}
            />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Route>
    )
  )
  const queryClient = new QueryClient()
  const [user, setUser] = useState<UserContextType | null>(
    localStorage.getItem("User")!?.length > 0
      ? (JSON.parse(localStorage.getItem("User")!) as UserContextType)
      : null
  )
  const userContextValue = useMemo(() => {
    return { user, setUser }
  }, [user, setUser])
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={userContextValue}>
        <RouterProvider router={router} />
      </UserContext.Provider>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
