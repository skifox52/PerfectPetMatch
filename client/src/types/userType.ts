export interface singleUserInterface {
  _id: string
  nom: string
  prenom: string
  mot_de_passe?: string
  mail: string
  sexe: "homme" | "femme"
  adresse: string
  date_de_naissance: Date
  ville: string
  role: "user" | "admin"
  image: string
  googleID?: string
  age: number
  createdAt: Date
  updatedAt: Date
}
