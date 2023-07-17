import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineInfoCircle, AiOutlineMessage } from "react-icons/ai"
import { RiContactsBookLine } from "react-icons/ri"
import { MdOutlineArticle } from "react-icons/md"
import { LuShoppingBag } from "react-icons/lu"
import { useAuth } from "../hooks/useAuth"
import { Notification } from "./Notification"
import { useQuery } from "@tanstack/react-query"
import { findById } from "../api/userApi"
import { toast } from "react-hot-toast"
import profileCardPicture from "../assets/pictures/profileCard.jpg"

interface SideMenuProps {}
export const SideMenu: React.FC<SideMenuProps> = ({}) => {
  const userContext = useAuth()
  const id = userContext?.user?._id as string
  const [userData, setUserData] = useState<{ nom: String; prenom: string }>({
    nom: "",
    prenom: "",
  })
  const { data, isLoading, isError, error, isSuccess } = useQuery<
    { id: string },
    any,
    any
  >({
    queryKey: ["user", id],
    queryFn: () => findById(id),
  })
  useEffect(() => {
    isError && toast.error(error.response?.err?.data || error.message)
    isSuccess && setUserData({ nom: data.nom, prenom: data.prenom })
  }, [isError, isSuccess])
  return (
    <ul className="menu  w-3/5 font-bold text-lg max-w-full  sticky top-4 h-fit">
      {!isLoading && (
        <div className=" h-80 flex flex-col items-center justify-between shadow-lg mb-8 overflow-hidden bg-white rounded-xl">
          <section className="h-1/2  relative">
            <img
              src={profileCardPicture}
              className="object-center object-cover w-full h-full"
            />
            <img
              src={userContext?.user?.profilePicture}
              className="w-24 border border-gray-50 shadow rounded-full absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2"
            />
          </section>
          <div className="flex flex-col items-center justify-between w-full gap-4">
            <span className="text-gray-600 text-md font-semibold">
              {userData.nom} {userData.prenom}
            </span>
            <li className="w-full">
              <Link
                to={"/profile"}
                className="flex items-center hover:bg-accent  focus:bg-success gap-2 justify-center text-gray-50 bg-primary"
              >
                Afficher le profile
              </Link>
            </li>
          </div>
        </div>
      )}
      <div className="flex flex-col  justify-between shadow-lg mb-8 bg-white rounded-xl">
        <Notification />
      </div>
      <div className="flex flex-col  justify-between shadow-lg mb-8 bg-white rounded-xl">
        <li>
          <Link
            to={"/messagerie"}
            className="flex py-4 items-center gap-8 rounded-t-xl"
          >
            <AiOutlineMessage className="text-2xl text-gray-600" /> Méssagerie
          </Link>
        </li>

        <li>
          <Link to="/market" className="flex py-4 items-center gap-8 ">
            <LuShoppingBag className="text-2xl text-gray-600" /> Market
          </Link>
        </li>
        <li>
          <Link to="/posts" className="flex py-4 items-center gap-8">
            <MdOutlineArticle className="text-2xl text-gray-600" /> Posts
          </Link>
        </li>
        <li>
          <Link to="/posts" className="flex py-4 items-center gap-8">
            <AiOutlineInfoCircle className="text-2xl text-gray-600" /> About us
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="flex py-4 items-center gap-8 rounded-b-xl"
          >
            <RiContactsBookLine className="text-2xl text-gray-600" /> Contact us
          </Link>
        </li>
      </div>
    </ul>
  )
}
