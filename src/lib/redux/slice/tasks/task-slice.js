import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "src/lib/utils/axios"

const initialState = {
  tasks: [],
  loading: false,
  error: null,
}

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/tasks")
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const createTask = createAsyncThunk("tasks/createTask", async (taskData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/tasks", taskData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ id, taskData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/tasks/${id}`, taskData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/tasks/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

const task = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload)
      })
  },
})

export default task.reducer
