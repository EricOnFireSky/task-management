import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { User } from "server/models/User.mjs"
import dbConnect from "src/lib/db"

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req) {
  try {
    await dbConnect()
    const { email, password } = await req.json()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Email Not found" }, { status: 401 })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 404 })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" })

    return NextResponse.json({
      message: "Login successful",
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
