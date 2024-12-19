import { configureStore } from "@reduxjs/toolkit"
import taskReducer from "./slice/tasks/task-slice"
import authReducer from "./slice/auth/auth-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
  },
})
