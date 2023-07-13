import axios from "axios"
import type { PostInterface, CommentInterface } from "../types/postType"

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
//Post a post
export const postPost = async (
  token: string,
  postData: FormData
): Promise<{ Status: boolean; Post: PostInterface }> => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post(
      `${import.meta.env.VITE_API_GATEWAY}/api/post/`,
      postData,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}

//Comment section
//--Add a comment
export const postComment = async (
  token: string,
  content: string,
  postId: string
): Promise<CommentInterface> => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.post<CommentInterface>(
      `${import.meta.env.VITE_API_GATEWAY}/api/post/comment`,
      { content, postId },
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//--Fetch comments
export interface FetchCommentsInterface {
  pages: CommentInterface[]
  pageCount: number
}
export const fetchComments = async ({
  pageParam = 1,
  token,
  postId,
}: {
  pageParam?: number
  token: string
  postId: string
}): Promise<FetchCommentsInterface> => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }
    const response = await axios.get<FetchCommentsInterface>(
      `${
        import.meta.env.VITE_API_GATEWAY
      }/api/post/comment/${postId}?page=${pageParam}`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
