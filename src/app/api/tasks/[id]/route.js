import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verifyToken } from "src/lib/auth"
import { Task } from "server/models/Task.mjs"
import dbConnect from "src/lib/db"

export async function PUT(req, { params }) {
  try {
    await dbConnect()
    const headersList = await headers()
    const token = headersList.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const taskData = await req.json()

    const task = await Task.findOneAndUpdate({ _id: params.id, userId: decoded.userId }, taskData, { new: true })

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect()
    const headersList = await headers()
    const token = headersList.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)

    const task = await Task.findOneAndDelete({
      _id: params.id,
      userId: decoded.userId,
    })

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
