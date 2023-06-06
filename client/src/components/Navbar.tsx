import React from "react"
import { Link } from "react-router-dom"

export const Navbar: React.FC = ({}) => {
  return (
    <nav className="h-[10vh] py-4 bg-base-200 shadow-xl relative z-50 px-8 flex items-center justify-between w-full ">
      <div>
        <button className="btn btn-neutral font-normal btn-outline rounded-xl">
          Déconnexion
        </button>
      </div>
      <ul className="flex  lg:menu-horizontal gap-10 text-neutral text-xl font-normal tracking-wide">
        <li>
          <Link to={"/"} className="hover:text-primary">
            Home
          </Link>
        </li>
        <li>
          <Link to={"/posts"} className="hover:text-primary">
            Posts
          </Link>
        </li>
        <li>
          <Link to={"/profile"} className="hover:text-primary">
            Profile
          </Link>
        </li>
        <li>
          <Link to={"/about"} className="hover:text-primary">
            About
          </Link>
        </li>
        <li>
          <Link to={"/contact"} className="hover:text-primary">
            Contact
          </Link>
        </li>
        <li>
          <Link to={"/pets"} className="hover:text-primary">
            Pets
          </Link>
        </li>
      </ul>
      <div className="flex h-full gap-8">
        <div className="avatar">
          <div className="h-full rounded-full ">
            <img
              className=" object-cover object-center"
              src="https://c8.alamy.com/zoomsfr/9/d4c59d90389444e3b1166312d2f7fa51/p9mywr.jpg"
            />
          </div>
        </div>
        <Link
          to={"/messagerie"}
          className="flex items-center gap-3 hover:text-primary text-neutral text-xl font-normal tracking-wide"
        >
          Messages
          <span className="badge bg-red-600  border-none  text-white badge-md ring ring-red-600 ring-offset-base-200 ring-offset-2">
            99+
          </span>
        </Link>
      </div>
    </nav>
  )
}
