import express from "express"
import { register, login, verifyEmail } from "../controllers/auth.mjs"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/verify-email/:token", verifyEmail)

export default router
