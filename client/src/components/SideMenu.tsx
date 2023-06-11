import React from "react"
import { Link } from "react-router-dom"

interface SideMenuProps {}

export const SideMenu: React.FC<SideMenuProps> = ({}) => {
  return (
    <ul className="menu bg-white w-56 rounded-box shadow-md">
      <li>
        <Link to={"/messagerie"}>Méssagerie</Link>
      </li>
      <li>
        <details open>
          <summary>Pets</summary>
          <ul>
            <li>
              <Link to={"/pets"}>Show pets</Link>
            </li>
            <li>
              <Link to={"nPet"}>Add a pet </Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
    </ul>
  )
}
