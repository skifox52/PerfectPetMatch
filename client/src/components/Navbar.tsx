import React from "react"
import { Link } from "react-router-dom"

export const Navbar: React.FC = ({}) => {
  return (
    <nav className="h-[10%] py-4 px-8 flex items-center justify-center">
      <ul className="flex border-4 rounded-lg border-white p-3 lg:menu-horizontal gap-8 text-base-100 font-extrabold tracking-wide">
        <li>
          <Link to={"/"} className="hover:text-neutral">
            Home
          </Link>
        </li>
        <li>
          <Link to={"/posts"} className="hover:text-neutral">
            Posts
          </Link>
        </li>
        <li>
          <Link to={"/profile"} className="hover:text-neutral">
            Profile
          </Link>
        </li>
        <li>
          <Link to={"/about"} className="hover:text-neutral">
            About
          </Link>
        </li>
        <li>
          <Link to={"/contact"} className="hover:text-neutral">
            Contact
          </Link>
        </li>
        <li>
          <Link
            to={"/messagerie"}
            className="flex items-center gap-1 hover:text-neutral"
          >
            Messages
            <span className="badge bg-red-600  border-white text-white badge-md">
              99+
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
