import axios, { AxiosInstance, AxiosResponse } from "axios"

async function refreshAccessToken() {
  const refreshToken = JSON.parse(localStorage.getItem("User")!)
    .refreshToken as string
  const resposne = await axios.post("http://localhost:3333/api/auth/refresh", {
    refreshToken,
  })
  return resposne.data.token
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY,
})
// Add request interceptor to handle access token refresh
api.interceptors.request.use(
  async (config) => {
    // Check if the access token is present and not expired
    const accessToken = JSON.parse(localStorage.getItem("User")!)
      .accessToken as string

    // Add the access token to the request header if it exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 400 &&
      (error.response.data.err === "TokenExpiredError: jwt expired" ||
        error.response.data.err === "Error: You are not authorized, No token!")
    ) {
      try {
        // Refresh the access token
        const refreshedAccessToken = await refreshAccessToken()

        const storageData = JSON.parse(localStorage.getItem("User")!)

        const newStorageData = {
          ...storageData,
          accessToken: refreshedAccessToken,
        }
        // Save the new access token
        localStorage.setItem("User", JSON.stringify(newStorageData))

        originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError)
        throw refreshError
      }
    }

    return Promise.reject(error)
  }
)

export default api
