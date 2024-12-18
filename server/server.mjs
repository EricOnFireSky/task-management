import express from "express"
import cors from "cors"
import { config } from "./config/env.mjs"
import { connectDB } from "./config/database.mjs"
import { errorHandler } from "./middleware/error.mjs"
import authRoutes from "./routes/auth.mjs"
import taskRoutes from "./routes/tasks.mjs"

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

// Error handling
app.use(errorHandler)

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
