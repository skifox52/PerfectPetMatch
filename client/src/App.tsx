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
import ProtectUser from "./hooks/ProtectRoutes"
import { Messages } from "./pages/Messages"
import { Profile } from "./pages/Profile"
import { ChatBody } from "./components/ChatBody"
import { ChatInbox } from "./components/ChatInbox"
import { Contact } from "./pages/Contact"
import { SinglePost } from "./pages/SinglePost"
import { Articles } from "./pages/Articles"
import { DetailArticle } from "./pages/DetailArticle"
import { About } from "./pages/About"
import { Settings } from "./pages/Settings"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/contact"
          element={<ProtectUser element={<Contact />} />}
        />
        <Route
          path="/articles"
          element={<ProtectUser element={<Articles />} />}
        />
        <Route path="/about" element={<ProtectUser element={<About />} />} />
        <Route
          path="/articles/:id"
          element={<ProtectUser element={<DetailArticle />} />}
        />
        <Route
          path="/post/:id"
          element={<ProtectUser element={<SinglePost />} />}
        />
        <Route
          path="/settings"
          element={<ProtectUser element={<Settings />} />}
        />
        <Route
          path="/google-fill-form"
          element={<ProtectUser element={<FillForm />} />}
        />
        <Route
          path="/resetPassword"
          element={<ProtectUser element={<ResetPassword />} />}
        />
        <Route index element={<ProtectUser element={<Home />} />} />
        <Route
          path="/messagerie"
          element={<ProtectUser element={<Messages />} />}
        >
          <Route index element={<ChatInbox />} />
          <Route path="/messagerie/c/:conversationId" element={<ChatBody />} />
        </Route>
        <Route
          path="/profile/:id"
          element={<ProtectUser element={<Profile />} />}
        />
        <Route path="/*" element={<NotFound />} />
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
