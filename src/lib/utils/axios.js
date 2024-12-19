import axios from "axios"
import { getStoredToken, removeStoredToken } from "./token"

axios.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeStoredToken()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default axios
