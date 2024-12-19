import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "src/lib/db"
import { User } from "server/models/User.mjs"

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req) {
  try {
    await dbConnect()
    const { email, password, name } = await req.json()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const user = await User.create({
      email,
      password,
      name,
    })

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" })

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
