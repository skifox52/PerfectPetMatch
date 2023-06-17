import axios from "axios"
import type { PostInterface } from "../types/postType"

//Get all posts
export const getPosts = async (
  token: string
): Promise<PostInterface[] | []> => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }
    const response = await axios.get<PostInterface[] | []>(
      `${import.meta.env.VITE_API_GATEWAY}/api/post/all`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
