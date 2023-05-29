import React, { useState } from "react"
import Lottie from "lottie-react"
import animationData from "../assets/animations/95961-puppy-sleeping.json"
import animationDataTwo from "../assets/animations/97059-pets.json"
import { Link } from "react-router-dom"
import wilayas from "../data/wilayas.json"

import { toast } from "react-hot-toast"

export interface UserDataInterface {
  nom: string
  prenom: string
  mail: string
  mot_de_passe: string
  sexe: string
  date_de_naissance: Date | null
  image: string
  ville: string
}
interface UserFormDataInterface extends UserDataInterface {
  confirmer_mot_de_passe: string
}
export const Register: React.FC = ({}) => {
  //User form data
  const [userFormData, setUserFormData] = useState<UserFormDataInterface>({
    nom: "",
    prenom: "",
    mail: "",
    date_de_naissance: null,
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
    sexe: "",
    image: "",
    ville: "",
  })
  //Handle form onChange function
  const handleOnChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    setUserFormData((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }))
  }
  //onSubmit function
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    //Handeling some exceptions
    if (!userFormData.mail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return toast.error("Adresse mail incorrect!")
    }
    if (userFormData.mot_de_passe !== userFormData.confirmer_mot_de_passe) {
      return toast.error("Vérifiez vos mots de passe")
    }
    if (userFormData.mot_de_passe.length < 8) {
      return toast.error("Mot de passe trop faible")
    }
  }

  console.log(userFormData)
  return (
    <div className="w-screen h-screen flex">
      <div className="h-full w-1/2">
        <Lottie animationData={animationData} className="h-screen" />
      </div>
      <section className="w-1/2 h-full bg-primary bg-opacity-70 flex justify-center items-start">
        <div className="w-3/5  flex flex-col items-center justify-center">
          <div className="w-32">
            <Lottie animationData={animationDataTwo} className="h-full" />
          </div>
          <form
            onSubmit={onSubmit}
            className="w-full bg-base-100 bg-opacity-50 rounded-2xl p-8 flex flex-col items-center gap-2 text-gray-700"
          >
            <input
              type="text"
              required
              placeholder="Nom..."
              name="nom"
              className="input input-bordered input-primary w-full"
              onChange={handleOnChange}
            />
            <input
              type="text"
              required
              placeholder="Prénom..."
              name="prenom"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <input
              type="mail"
              required
              placeholder="Email..."
              name="mail"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <input
              type="password"
              required
              placeholder="Password..."
              name="mot_de_passe"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <input
              type="password"
              required
              name="confirmer_mot_de_passe"
              onChange={handleOnChange}
              placeholder="Confirm password..."
              className="input input-bordered input-primary w-full"
            />
            <input
              type="text"
              required
              placeholder="Adresse..."
              name="adresse"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <select
              className="select select-primary w-full"
              name="sexe"
              onChange={handleOnChange}
              required
              defaultValue={""}
            >
              <option disabled hidden value={""}>
                Sexe
              </option>
              <option>Homme</option>
              <option>Femme</option>
            </select>
            <input
              type="date"
              required
              name="date_de_naissance"
              onChange={handleOnChange}
              className="input input-bordered input-primary w-full"
            />
            <select
              className="select select-primary w-full"
              name="ville"
              onChange={handleOnChange}
              required
              defaultValue={""}
            >
              <option disabled hidden value={""}>
                Ville
              </option>
              {wilayas.map((wilaya) => (
                <option key={wilaya.id} value={wilaya.nom}>
                  {wilaya.code} - {wilaya.nom}
                </option>
              ))}
            </select>
            <input
              name="image"
              onChange={handleOnChange}
              type="file"
              className="file-input file-input-bordered file-input-primary w-full"
            />
            <button type="submit" className="btn btn-primary text-white w-full">
              S'enregistrer
            </button>
            <div className="w-full flex justify-end">
              <Link
                to="/login"
                className="text-primary hover:text-black undelrines w-fit"
              >
                J'ai déjà un compte
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
