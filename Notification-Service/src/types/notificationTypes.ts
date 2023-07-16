interface UserNotification {
  nom: string
  prenom: string
  image: string
  googleID: string
}

export interface NotificationType {
  type: string
  post: string
  user: UserNotification
  comment?: string
  timeStamps: number
  isSeen: boolean
}
