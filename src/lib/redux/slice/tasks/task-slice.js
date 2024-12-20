import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { tasksApi } from "src/lib/api/tasks"

const initialState = {
  tasks: [],
  loading: false,
  error: null,
}

export const fetchTasks = createAsyncThunk("task/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await tasksApi.getTasks()
    return response
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const createTask = createAsyncThunk("task/createTask", async (taskData, { rejectWithValue }) => {
  try {
    const response = await tasksApi.createTask(taskData)
    return response
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const updateTask = createAsyncThunk("task/updateTask", async ({ id, taskData }, { rejectWithValue }) => {
  try {
    const response = await tasksApi.updateTask(id, taskData)
    return response
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const deleteTask = createAsyncThunk("task/deleteTask", async (id, { rejectWithValue }) => {
  try {
    await tasksApi.deleteTask(id)
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
