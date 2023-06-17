//Owner type
interface OwnerType {
  image: string
  nom: string
  prenom: string
  _id: string
  mail: string
}

//--Post Type
export interface PostInterface {
  _id: string
  owner: OwnerType
  comments: string[]
  title: string
  content: string
  images: string[]
  pet: string
  likes: number
  reports: number
}
