import React from "react"
import { Link } from "react-router-dom"
import { AiOutlineMessage } from "react-icons/ai"
import { MdOutlinePets, MdOutlineArticle } from "react-icons/md"
import { LuShoppingBag } from "react-icons/lu"
import { useAuth } from "../hooks/useAuth"
import { Notification } from "./Notification"

interface SideMenuProps {}

export const SideMenu: React.FC<SideMenuProps> = ({}) => {
  const userContext = useAuth()
  return (
    <ul className="menu bg-white w-2/3 font-bold text-lg max-w-full rounded-box shadow-md sticky top-4 h-fit">
      <li>
        <Notification />
      </li>
      <li>
        <Link to={"/profile"} className="flex items-center gap-2">
          <img
            src={userContext?.user?.profilePicture}
            className="w-10 rounded-full"
          />{" "}
          Profile
        </Link>
      </li>
      <li>
        <Link to={"/messagerie"} className="flex items-center gap-2">
          <AiOutlineMessage /> Méssagerie
        </Link>
      </li>
      <li>
        <details open>
          <summary className="flex items-center gap-2">
            <MdOutlinePets /> Pets
          </summary>
          <ul>
            <li>
              <Link to={"/pets"}>Show pets</Link>
            </li>
            <li>
              <Link to={"/Pet"}>Add a pet </Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <Link to="/market" className="flex items-center gap-2">
          <LuShoppingBag /> Market
        </Link>
      </li>
      <li>
        <Link to="/posts" className="flex items-center gap-2">
          <MdOutlineArticle /> Posts
        </Link>
      </li>
    </ul>
  )
}
