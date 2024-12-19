import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded || {}
  } catch (error) {
    throw new Error("Invalid token")
  }
}
