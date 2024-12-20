import axios from "src/lib/utils/axios"

export const authApi = {
  login: async (credentials) => {
    const response = await axios.post("/auth/login", credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await axios.post("/auth/register", userData)
    return response.data
  },
}
