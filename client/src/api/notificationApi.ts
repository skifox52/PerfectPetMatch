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
//Mark notification as seen
export const markNotificationsAsSeen = async (
  token: string
): Promise<{ success: boolean; message: string }> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.put<{ success: boolean; message: string }>(
      `${import.meta.env.VITE_API_GATEWAY}/api/notifications`,
      {},
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
