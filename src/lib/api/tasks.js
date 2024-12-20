import axios from "src/lib/utils/axios"

export const tasksApi = {
  getTasks: async () => {
    const response = await axios.get("/tasks")
    return response.data
  },

  createTask: async (taskData) => {
    const response = await axios.post("/tasks", taskData)
    return response.data
  },

  updateTask: async (id, taskData) => {
    const response = await axios.put(`/tasks/${id}`, taskData)
    return response.data
  },

  deleteTask: async (id) => {
    await axios.delete(`/tasks/${id}`)
    return id
  },
}
