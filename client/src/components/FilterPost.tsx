import React, { useState } from "react"
import searchSection from "../assets/pictures/searchSection.jpeg"
import { FaDog, FaCat, FaFilter } from "react-icons/fa"
import wilayas from "../data/wilayas.json"
import raceChein from "../data/dogs.json"
import raceChat from "../data/cats.json"

interface FilterPostProps {}

export const FilterPost: React.FC<FilterPostProps> = ({}) => {
  const [searchData, setSearchData] = useState<{
    wilaya: string
    animal: string
    race: string
    age: string
  }>({ wilaya: "", animal: "", race: "", age: "" })
  const handleOnChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSearchData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  //Handle on submit
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }
  return (
    <div className="w-2/3 h-full flex flex-col items-center justify-between shadow-lg mb-8 overflow-hidden pb-4 bg-white rounded-xl sticky top-4">
      <img
        src={searchSection}
        className="object-center object-cover w-full h-auto"
      />
      <section className="w-full">
        <h1 className="font-bold text-3xl text-center my-4 text-purple-500">
          Filtrer les annonces
        </h1>
        <form
          onSubmit={handleOnSubmit}
          className="bg-bgPrimary px-8  py-4 w-[90%] mx-auto border border-gray-200 rounded-xl grid grid-cols-2 gap-4"
        >
          <div className=" col-span-2 mx-auto flex gap-2 text-5xl">
            <FaDog className="fill-purple-500" />
            <FaCat className="fill-accent" />
          </div>
          <select
            name="wilaya"
            className="w-full  select select-primary select-sm"
            value={searchData.wilaya}
            onChange={handleOnChange}
          >
            <option value="" hidden disabled>
              Filtrer par wilayas
            </option>
            {wilayas.map((w) => (
              <option key={w.id} value={w.nom}>
                {w.nom}
              </option>
            ))}
          </select>
          <select
            name="age"
            value={searchData.age}
            onChange={handleOnChange}
            className="w-full  select select-primary select-sm"
          >
            <option value="" hidden disabled>
              Age
            </option>
            <option value="1">Moin d'un an</option>
            <option value="2">Entre 1 et 2ans</option>
            <option value="3">Entre 2 et 3ans</option>
            <option value="4">Entre 3 et 4ans</option>
            <option value="5">Entre 4 et 5ans</option>
            <option value="6">Plus de 5ans</option>
          </select>
          <select
            name="animal"
            value={searchData.animal}
            onChange={handleOnChange}
            className="w-full  select select-primary select-sm"
          >
            <option value="" hidden disabled>
              Filtrer par animal
            </option>
            <option value="chat">Chat</option>
            <option value="chien">Chien</option>
          </select>
          <select
            name="race"
            disabled={searchData.animal === ""}
            onChange={handleOnChange}
            value={searchData.race}
            className="w-full  select select-primary select-sm"
          >
            <option value="" hidden disabled>
              Filtrer par race
            </option>
            {searchData.animal === "chien"
              ? raceChein.races_de_chiens.map((r, i) => (
                  <option value={r} key={i}>
                    {r}
                  </option>
                ))
              : raceChat.races_de_chats.map((r, i) => (
                  <option value={r} key={i}>
                    {r}
                  </option>
                ))}
          </select>
          <button
            type="submit"
            className="flex items-center text-lg gap-4 font-normal shadow text-gray-50 col-span-2 btn btn-accent btn-sm mt-2"
          >
            Filtrer <FaFilter className="text-sm" />
          </button>
        </form>
      </section>
    </div>
  )
}
