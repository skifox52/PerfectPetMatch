import axios from "axios"

//Join conversation
export const joinConversation = async (
  user1: string,
  user2: string,
  token: string
): Promise<{ conversationId: string }> => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  try {
    const response = await axios.post<{ conversationId: string }>(
      `${import.meta.env.VITE_API_GATEWAY}/api/chat/conversation`,
      { user1, user2 },
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Get conversations
export const getConversations = async (token: string) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get(
      `${import.meta.env.VITE_API_GATEWAY}/api/chat/conversation`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Get conversation messages
export const getConversationMessages = async (
  token: string,
  conversationId: string
) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get(
      `${import.meta.env.VITE_API_GATEWAY}/api/chat/messages/${conversationId}`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
