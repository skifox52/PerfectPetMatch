import axios from "axios"
import type { PostInterface, CommentInterface } from "../types/postType"

//Get all posts
export const getPosts = async (
  token: string,
  page: number,
  queryParams?: {
    wilaya?: string
    age?: string
    type?: "chat" | "chien" | ""
    race?: string
    category?: "adoption" | "accouplement"
  }
): Promise<{ posts: PostInterface[]; totalPages: number }> => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }
    let apiURI: string = `${
      import.meta.env.VITE_API_GATEWAY
    }/api/post/all?page=${page}`
    if (queryParams) {
      const { wilaya, age, type, race, category } = queryParams
      !!wilaya && (apiURI += `&wilaya=${encodeURIComponent(wilaya)}`)
      !!age && (apiURI += `&age=${encodeURIComponent(age)}`)
      !!type && (apiURI += `&type=${encodeURIComponent(type)}`)
      !!race && (apiURI += `&race=${encodeURIComponent(race)}`)
      !!category && (apiURI += `&category=${encodeURIComponent(category)}`)
    }
    const response = await axios.get<{
      posts: PostInterface[]
      totalPages: number
    }>(apiURI, config)
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
//Get post by ID
export const postById = async (id: string): Promise<PostInterface> => {
  try {
    const response = await axios.get<PostInterface>(
      `${import.meta.env.VITE_API_GATEWAY}/api/post/one?_id=${id}`
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
//--Delete a comment
export const deleteComment = async (
  token: string,
  commentId: string
): Promise<{ success: boolean; message: string }> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${import.meta.env.VITE_API_GATEWAY}/api/post/comment/${commentId}`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//--Update comment
export const updateComment = async (
  token: string,
  commentId: string,
  content: string
): Promise<{ success: boolean; message: string }> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.put<{ success: boolean; message: string }>(
      `${import.meta.env.VITE_API_GATEWAY}/api/post/comment/${commentId}`,
      { content },
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Likes section
//--Like a post
export const likePost = async (
  token: string,
  postId: string
): Promise<{ success: boolean; message: string }> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.post<{ success: boolean; message: string }>(
      `${import.meta.env.VITE_API_GATEWAY}/api/post/like?postId=${postId}`,
      {},
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//--Dislike a post
export const dislikePost = async (
  token: string,
  postId: string
): Promise<{ success: boolean; message: string }> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${import.meta.env.VITE_API_GATEWAY}/api/post/like?postId=${postId}`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Report a post
export const reportPost = async (
  token: string,
  postId: string,
  reason: string
): Promise<{ success: boolean; message: string }> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  try {
    return (
      await axios.post(
        `${import.meta.env.VITE_API_GATEWAY}/api/post/report?postId=${postId}`,
        { reason },
        config
      )
    ).data
  } catch (error) {
    throw error
  }
}
