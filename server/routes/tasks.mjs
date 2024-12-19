import express from "express"
import { auth } from "../middleware/auth.mjs"
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks.mjs"

const router = express.Router()

router.use(auth)

router.get("/task", getTasks)
router.post("/task", createTask)
router.put("/task/:id", updateTask)
router.delete("/task/:id", deleteTask)

export default router
