import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authApi } from "src/lib/api/auth"
import { removeStoredToken, setStoredToken } from "src/lib/utils/token"

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const data = await authApi.register(userData)
    setStoredToken(data.token)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed")
  }
})

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await authApi.login(credentials)
    setStoredToken(data.token)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed")
  }
})

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      removeStoredToken()
      location.href = "/login"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout } = auth.actions
export default auth.reducer
