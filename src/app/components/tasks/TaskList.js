import React, { useState } from "react"
import TaskForm from "./TaskForm"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import Modal from "../ui/Modal"
import { useAppDispatch } from "src/lib/redux/hooks"
import { Calendar, Flag, Clock, Edit2, Trash2 } from "lucide-react"
import { deleteTask } from "src/lib/redux/slice/tasks/task-slice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

// Separate utility functions
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

  return <Flag className={`w-3 h-3 ${color}`} />
}

// Separate TaskCard component
const TaskCard = ({ task, onEdit, onDelete }) => (
  <Card key={task._id} className="hover:shadow-md transition-shadow">
    <div className="p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {getPriorityIcon(task.priority)}
          <h3 className="text-sm font-medium truncate">{task.title}</h3>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-7 w-7 p-0">
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task._id)}
            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            task.status
          )}`}
        >
          <Clock className="w-3 h-3" />
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>

        {task.dueDate && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  </Card>
)

// Separate TaskRow component
const TaskRow = ({ task, onEdit, onDelete }) => (
  <TableRow>
    <TableCell className="font-medium">{task.title}</TableCell>
    <TableCell>
      <span className="flex items-center gap-1">
        {getPriorityIcon(task.priority)}
        <span className="text-sm capitalize">{task.priority}</span>
      </span>
    </TableCell>
    <TableCell>
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
          task.status
        )}`}
      >
        <Clock className="w-3 h-3" />
        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
      </span>
    </TableCell>
    <TableCell>
      {task.dueDate ? (
        <span className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3" />
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-gray-500 text-sm">No due date</span>
      )}
    </TableCell>
    <TableCell className="text-right">
      <div className="flex gap-1 justify-end">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-7 w-7 p-0">
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task._id)}
          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
)

// Main TaskList component
export default function TaskList({ tasks, viewMode }) {
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

  return (
    <>
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <TaskTable tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
      )}

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
    </>
  )
}

const TaskTable = ({ tasks, onEdit, onDelete }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30%]">Task</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TaskRow key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </TableBody>
    </Table>
  </div>
)
