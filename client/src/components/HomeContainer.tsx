import React, { useState, useRef, useEffect } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md"
import autoAnimate from "@formkit/auto-animate"
import { BsSearch } from "react-icons/bs"

export const HomeContainer: React.FC = () => {
  const parent = useRef(null)
  const [openFilter, setOpenFilter] = useState<boolean>(false)
  const [openAjouter, setOpenAjouter] = useState<boolean>(false)
  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])
  return (
    <div
      ref={parent}
      className="w-full flex flex-col gap-8  py-4 px-8 bg-black text-gray-100 shadow-lg shadow-secondary"
    >
      <div className="flex w-full gap-8">
        <button
          disabled={openFilter}
          onClick={(e) => setOpenAjouter(!openAjouter)}
          className="flex items-center gap-2 btn btn-secondary font-extrabold"
        >
          Ajouter une annonce <AiOutlinePlus />
        </button>
        <button
          disabled={openAjouter}
          className="flex items-center gap-2 btn btn-secondary font-extrabold"
        >
          Filtrer les annonces <MdFilterAlt />
        </button>
        {!openAjouter && (
          <div className="bg-red-200 flex-1 relative text-base-100 rounded-full bg-transparent">
            <input
              type="text"
              placeholder="Search..."
              className="h-full font-extrabold text-base-100 placeholder:text-base-100 placeholder:font-bold placeholder:tracking-wide placeholder:opacity-30 w-full border-2 rounded-full input input-secondary bg-transparent"
            />
            <BsSearch className="absolute top-1/2 -translate-y-1/2  right-4 fill-base-100 text-2xl opacity-30" />
          </div>
        )}
      </div>
      {openAjouter && (
        <div className="py-8 px-16">
          <form className="w-full flex flex-col gap-3">
            <div className="w-full flex gap-3">
              <input
                type="text"
                placeholder="Titre..."
                className="input input-secondary bg-transparent flex-1"
              />
              <select
                defaultValue={""}
                className=" select select-neutral bg-transparent border-2 border-secondary"
              >
                <option value="" hidden disabled>
                  Catégorie
                </option>
                <option value="">Test</option>
                <option value="">Test</option>
              </select>
              <label
                htmlFor="file"
                className=" cursor-pointer btn btn-secondary"
              >
                Ajouter des images
              </label>
              <input type="file" id="file" className="hidden" />
            </div>
            <div>
              <textarea
                name=""
                className="textarea textarea-secondary bg-transparent w-full"
              ></textarea>
            </div>
            <button className="w-full btn btn-secondary font-extrabold text-white">
              Publier
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
