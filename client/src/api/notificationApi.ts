import axios from "axios"
import { NotificationType } from "../types/notificationType"

//Get all norifications
export const fetchNotifications = async (
  token: string
): Promise<NotificationType[]> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.get<NotificationType[]>(
      `${import.meta.env.VITE_API_GATEWAY}/api/notifications`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
