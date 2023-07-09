//Owner type
interface OwnerType {
  image: string
  nom: string
  prenom: string
  _id: string
  mail: string
  googleID: string | undefined
}

//--Post Type
export interface PostInterface {
  _id: string
  owner: OwnerType
  comments: string[]
  category: string
  description: string
  images: string[]
  pet: string
  likes: number
  reports: number
  createdAt: Date
}
