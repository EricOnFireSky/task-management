import axios from "axios"

export const authApi = {
  login: async (credentials) => {
    const response = await axios.post("/api/auth/login", credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await axios.post("/api/auth/register", userData)
    return response.data
  },
}
