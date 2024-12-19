import axios from "axios"

export const tasksApi = {
  getTasks: async () => {
    const response = await axios.get("/api/tasks")
    return response.data
  },

  createTask: async (taskData) => {
    const response = await axios.post("/api/tasks", taskData)
    return response.data
  },

  updateTask: async (id, taskData) => {
    const response = await axios.put(`/api/tasks/${id}`, taskData)
    return response.data
  },

  deleteTask: async (id) => {
    await axios.delete(`/api/tasks/${id}`)
    return id
  },
}
