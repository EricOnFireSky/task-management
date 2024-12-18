import jwt from "jsonwebtoken"
import { config } from "../config/env.mjs"

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = { id: decoded.userId }
    next()
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" })
  }
}
