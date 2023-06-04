import React from "react"
import { Link } from "react-router-dom"

export const Navbar: React.FC = ({}) => {
  return (
    <nav className="h-[10%] py-4 px-8 flex items-center justify-center">
      <ul className="flex gap-8 text-base-100 font-bold tracking-wide">
        <li>
          <Link to={""}>Home</Link>
        </li>
        <li>
          <Link to={""}>Posts</Link>
        </li>
        <li>
          <Link to={""}>Profile</Link>
        </li>
        <li>
          <Link to={""}>About</Link>
        </li>
        <li>
          <Link to={""}>Contact</Link>
        </li>
      </ul>
    </nav>
  )
}
