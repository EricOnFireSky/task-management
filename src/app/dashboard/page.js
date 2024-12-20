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
import { CirclePlus, LogOut, ChevronDown, ChevronUp, LayoutGrid, Table as TableIcon } from "lucide-react"

import { logout } from "src/lib/redux/slice/auth/auth-slice"

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user)
  console.log("Dashboard  user-->", user)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState("card") // 'card' or 'table'
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
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              {overdueTasksCount > 0 && (
                <p className="text-red-600 text-sm">
                  {overdueTasksCount} task{overdueTasksCount !== 1 ? "s" : ""} overdue
                </p>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <Button
                className="flex gap-2 items-center"
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
              >
                Stats {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              <Button
                className="flex gap-2 items-center"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => dispatch(logout())} title="Logout">
                <LogOut size={16} className="mr-1" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {showStats && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <TaskStats tasks={tasks} />
              </div>
            )}

            {showFilters && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <TaskFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} setIsModalOpen={setIsModalOpen} />

        <TaskList tasks={filteredAndSortedTasks} viewMode={viewMode} />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
          <TaskForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      </div>
    </div>
  )
}

const ViewToggle = ({ viewMode, setViewMode, setIsModalOpen }) => (
  <div className="flex mb-4 justify-between items-center">
    <div className="flex gap-2">
      <Button
        variant={viewMode === "card" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("card")}
        className="flex items-center gap-2"
      >
        <LayoutGrid className="w-4 h-4" />
        Cards
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("table")}
        className="flex items-center gap-2"
      >
        <TableIcon className="w-4 h-4" />
        Table
      </Button>
    </div>

    <div>
      <Button size="sm" onClick={() => setIsModalOpen(true)}>
        <CirclePlus size={16} className="mr-1" /> Task
      </Button>
    </div>
  </div>
)
