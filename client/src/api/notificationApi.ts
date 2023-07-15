import axios from "axios"

//Get all norifications
export const fetchNotifications = async (token: string): Promise<string[]> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.get<string[]>(
      `${import.meta.env.VITE_API_GATEWAY}/api/notifications`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
