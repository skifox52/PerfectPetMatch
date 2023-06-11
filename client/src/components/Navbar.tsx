import React from "react"
import { Link } from "react-router-dom"

export const Navbar: React.FC = ({}) => {
  return (
    <div className="navbar bg-base-100 flex justify-between fixed  z-50 shadow-md">
      <div>
        <Link to={"/"} className="btn btn-ghost normal-case text-xl">
          <img src="/PPT.png" alt="logo" className="h-full" />
        </Link>
      </div>
      <div>
        <ul className="flex  lg:menu-horizontal gap-10 text-gray-600 text-xl font-semibold tracking-wide">
          <li>
            <Link to={"/"} className="hover:text-primary  ">
              Home
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
        </ul>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://c8.alamy.com/zoomsfr/9/d4c59d90389444e3b1166312d2f7fa51/p9mywr.jpg  " />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 font-semibold"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Pramètres</a>
            </li>
            <li>
              <a>Déconnexion</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
