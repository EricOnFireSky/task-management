import React, { useState } from "react"
import TaskForm from "./TaskForm"
import { Card, CardHeader, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import Modal from "../ui/Modal"
import { useAppDispatch } from "src/lib/redux/hooks"
import { Calendar, Flag, Clock, Edit2, Trash2, AlertCircle } from "lucide-react"
import { deleteTask } from "src/lib/redux/slice/tasks/task-slice"

export default function TaskList({ tasks }) {
  const [editTask, setEditTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()

  const handleEdit = (task) => {
    setEditTask(task)
    setIsModalOpen(true)
  }

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(taskId)).unwrap()
      } catch (error) {
        console.error("Failed to delete task:", error)
      }
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return colors[priority] || colors.medium
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-gray-100 text-gray-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    }
    return colors[status] || colors.pending
  }

  const getPriorityIcon = (priority) => {
    const color =
      {
        low: "text-green-600",
        medium: "text-yellow-600",
        high: "text-red-600",
      }[priority] || "text-yellow-600"

    return <Flag className={`w-4 h-4 ${color}`} />
  }

  return (
    <React.Fragment>
      {tasks.map((task) => (
        <Card key={task._id} className="hover:shadow-lg transition-shadow">
          <CardHeader className={"p-4"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getPriorityIcon(task.priority)}
                <h3 className="text-lg font-semibold">{task.title}</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(task)} className="hover:bg-gray-100">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(task._id)}
                  className="hover:bg-red-100 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className={"p-4"}>
            {task.description && <p className="text-gray-600 mb-4">{task.description}</p>}

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                <AlertCircle className="w-3 h-3" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>

              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                <Clock className="w-3 h-3" />
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>

              {task.dueDate ? (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Calendar className="w-3 h-3" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <Calendar className="w-3 h-3" />
                  No Due Date
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditTask(null)
        }}
        title={editTask ? "Edit Task" : "Create Task"}
      >
        <TaskForm
          task={editTask}
          onClose={() => {
            setIsModalOpen(false)
            setEditTask(null)
          }}
        />
      </Modal>
    </React.Fragment>
  )
}
