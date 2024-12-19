"use client"

import { useEffect, useState, useMemo } from "react"
import { isOverdue } from "src/utils/date"
import { Button } from "../components/ui/button"
import TaskFilters from "../components/dashboard/TaskFilters"
import Modal from "../components/ui/Modal"
import TaskList from "../components/tasks/TaskList"
import TaskForm from "../components/tasks/TaskForm"
import TaskStats from "../components/dashboard/TaskStats"
import { useAppDispatch, useAppSelector } from "src/lib/redux/hooks"
import { fetchTasks } from "src/lib/redux/slice/tasks/task-slice"
import { CirclePlus, LogOut } from "lucide-react"
import { logout } from "src/lib/redux/slice/auth/auth-slice"

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sortBy: "dueDate",
  })

  const dispatch = useAppDispatch()
  const { tasks, loading, error } = useAppSelector((state) => state.task)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks]

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) || task.description?.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status) {
      result = result.filter((task) => task.status === filters.status)
    }

    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "dueDate":
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        case "status": {
          const statusOrder = { pending: 0, "in-progress": 1, completed: 2 }
          return statusOrder[a.status] - statusOrder[b.status]
        }
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return result
  }, [tasks, filters])

  const overdueTasksCount = tasks.filter(
    (task) => task.status !== "completed" && task.dueDate && isOverdue(task.dueDate)
  ).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-white rounded-lg shadow-md" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white rounded-lg shadow-md" />
              ))}
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-lg shadow-md" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            {overdueTasksCount > 0 && (
              <p className="text-red-600 mt-1">
                {overdueTasksCount} task{overdueTasksCount !== 1 ? "s" : ""} overdue
              </p>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <Button
              onClick={() => {
                dispatch(logout())
              }}
            >
              <LogOut size="16" className="mr-1" /> Logout
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <CirclePlus size="16" className="mr-1" /> Task
            </Button>
          </div>
        </div>

        <TaskStats tasks={tasks} />

        <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TaskList tasks={filteredAndSortedTasks} />
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
          <TaskForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      </div>
    </div>
  )
}
