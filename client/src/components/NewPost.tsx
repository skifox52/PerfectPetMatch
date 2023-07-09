import { useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import dogs from "../data/dogs.json"
import cats from "../data/cats.json"
import {
  AiOutlinePlusCircle,
  AiFillPicture,
  AiFillCloseCircle,
} from "react-icons/ai"
import { MdPets } from "react-icons/md"
import { postPost } from "../api/postApi"
import { useAuth } from "../hooks/useAuth"

interface NewPostProps {}

export const NewPost: React.FC<NewPostProps> = ({}) => {
  const checkBoxRef = useRef<HTMLInputElement>(null)
  const client = useQueryClient()
  const [formData, setFormData] = useState<{
    category: string
    description: string
    type: string
    race: string
    sexe: string
    date_de_naissance: Date | null
  }>({
    category: "",
    description: "",
    type: "",
    race: "",
    sexe: "",
    date_de_naissance: null,
  })
  //Input onchange
  const handleOnChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  //File upload onChange
  const [imagePreview, setImagePreview] = useState<File[]>([])
  const handleFileOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const files = e.target.files
    if (files) {
      const imageFiles = [...files]
      setImagePreview((prev) => [...prev, ...imageFiles])
    }
  }
  const removePreview = (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    img: any
  ) => {
    setImagePreview((prev) => {
      return prev.filter((im) => im !== img)
    })
  }
  //Post mutation
  const [loadingToast, setLoadingToast] = useState<any>(null)
  const dataForm = new FormData()
  const { accessToken } = useAuth()?.user!
  const postMutaion = useMutation({
    mutationFn: (variables: FormData) => postPost(accessToken, variables),
    onError: (error: any) => {
      toast.error(error.response.data.err || error.message)
    },
  })
  //Handle onSubmit
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    Object.entries(formData).forEach(([key, value]) =>
      dataForm.append(key, value?.toString()!)
    )
    imagePreview.length > 0 &&
      imagePreview.forEach((img) => dataForm.append("images", img))
    postMutaion.mutate(dataForm)
  }
  useEffect(() => {
    if (postMutaion.isLoading) {
      setLoadingToast(toast.loading("Connexion..."))
    } else {
      setLoadingToast(null)
      toast.dismiss(loadingToast)
    }
    if (postMutaion.isSuccess) {
      toast.success("Post ajouter avec succès!")
      setImagePreview([])
      setFormData({
        category: "",
        description: "",
        date_de_naissance: null,
        type: "",
        race: "",
        sexe: "",
      })
      client.invalidateQueries(["posts"])
      if (checkBoxRef.current) {
        checkBoxRef.current.checked = false
      }
    }
  }, [postMutaion.isLoading, postMutaion.isSuccess])
  return (
    <React.Fragment>
      <label
        htmlFor="my_modal_6"
        className="btn btn-primary font-bold text-gray-50 flex items-center gap-4 mt-8"
      >
        Ajouter un post <AiOutlinePlusCircle className="text-2xl" />
      </label>

      <input
        type="checkbox"
        id="my_modal_6"
        ref={checkBoxRef}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-primary text-center">
            Ajouter un post
          </h3>
          <form
            className="flex flex-col gap-3 p-4"
            onSubmit={handleOnSubmit}
            encType="multipart/form-data"
          >
            <select
              name="category"
              value={formData.category}
              onChange={handleOnChange}
              className=" select select-primary "
              required
            >
              <option value="" hidden disabled>
                Sélectionnez une catégorie
              </option>
              <option value="adoption">Adoption</option>
              <option value="accouplement">Accouplement</option>
            </select>
            <textarea
              className="textarea textarea-primary w-full"
              placeholder="Description..."
              name="description"
              value={formData.description}
              required
              onChange={handleOnChange}
            ></textarea>
            <div className="flex flex-col gap-4 items-center bg-bgPrimary p-4 rounded-lg border border-gray-200 shadow-md">
              <MdPets className="fill-primary text-4xl" />
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleOnChange}
                  className=" select select-primary select-sm"
                  required
                >
                  <option value="" hidden disabled>
                    Sélectionnez un type
                  </option>
                  <option value="chat">Chat</option>
                  <option value="chien">Chien</option>
                </select>
                <select
                  name="race"
                  value={formData.race}
                  onChange={handleOnChange}
                  disabled={formData.type === ""}
                  className=" select select-primary select-sm"
                  required
                >
                  <option value="" hidden disabled>
                    Sélectionnez une race
                  </option>
                  {formData.type === "chien"
                    ? dogs.races_de_chiens.map((r, i) => (
                        <option value={r} key={i}>
                          {r}
                        </option>
                      ))
                    : cats.races_de_chats.map((r, i) => (
                        <option value={r} key={i}>
                          {r}
                        </option>
                      ))}
                </select>
                <div className="flex items-end gap-4 col-span-2">
                  <div className="w-1/2 flex flex-col gap-2">
                    <label
                      htmlFor="date"
                      className="label-text text-xs text-gray-600"
                    >
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date_de_naissance"
                      className="input input-primary input-sm w-full"
                      onChange={handleOnChange}
                      required
                    />
                  </div>

                  <select
                    id="date"
                    name="sexe"
                    className="input input-primary input-sm w-1/2"
                    value={formData.sexe}
                    onChange={handleOnChange}
                  >
                    <option value="" hidden disabled>
                      Sexe
                    </option>
                    <option value={"male"}>Male</option>
                    <option value={"femelle"}>Femelle</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              {imagePreview.length > 0 && (
                <div className="w-full grid grid-cols-3 gap-2 my-4">
                  {imagePreview.length > 0 &&
                    imagePreview.map((img, i) => (
                      <div key={img.size + i} className="relative">
                        <AiFillCloseCircle
                          onClick={(e) => removePreview(e, img)}
                          className="absolute top-2 right-2 fill-error hover:bg-red-600 transition-colors duration-200 hover:cursor-pointer rounded-full"
                        />
                        <img
                          src={URL.createObjectURL(img)}
                          alt="Post image"
                          className=" border h-full w-full object-contain border-gray-200 rounded-lg shadow-md"
                        />
                      </div>
                    ))}
                </div>
              )}
              <label
                htmlFor="file"
                className="flex items-center gap-4 font-bold text-gray-50 btn btn-primary  w-full"
              >
                Ajouter des photos <AiFillPicture className="text-2xl" />
              </label>
              <input
                type="file"
                name="images"
                onChange={handleFileOnChange}
                className="hidden"
                id="file"
              />
            </div>
            <button
              type="submit"
              className="btn btn-success font-bold text-gray-50"
              disabled={
                formData.category === "" ||
                formData.description === "" ||
                formData.race === "" ||
                formData.type === "" ||
                formData.sexe === "" ||
                formData.date_de_naissance === null ||
                postMutaion.isLoading === true
              }
            >
              Ajouter
            </button>
          </form>
          <div className="modal-action">
            <label
              htmlFor="my_modal_6"
              className="btn btn-accent btn-sm   font-bold text-gray-50"
              onClick={() => {
                setImagePreview([])
                setFormData({
                  category: "",
                  description: "",
                  date_de_naissance: null,
                  type: "",
                  race: "",
                  sexe: "",
                })
              }}
            >
              Annuler
            </label>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
