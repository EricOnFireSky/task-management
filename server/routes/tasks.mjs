import express from "express"
import { auth } from "../middleware/auth.mjs"
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks.mjs"

const router = express.Router()

router.use(auth)

router.get("/", getTasks)
router.post("/", createTask)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)

export default router
