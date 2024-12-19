import { NextResponse } from "next/server"
import { headers } from "next/headers"
import dbConnect from "src/lib/db"
import { Task } from "server/models/Task.mjs"
import { verifyToken } from "src/lib/auth"

export async function GET() {
  try {
    await dbConnect()
    const headersList = await headers()
    const token = headersList.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const tasks = await Task.find({ userId: decoded.userId })

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await dbConnect()
    const headersList = await headers()
    const token = headersList.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const taskData = await req.json()

    const task = await Task.create({
      ...taskData,
      userId: decoded.userId,
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
