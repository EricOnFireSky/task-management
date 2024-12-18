import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/User.mjs"
import { config } from "../config/env.mjs"

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = await User.create({
      email,
      password,
      name,
    })

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: "7d" })

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}
