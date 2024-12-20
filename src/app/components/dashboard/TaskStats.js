import { Card } from "../ui/card"

export default function TaskStats({ tasks }) {
  const stats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    pending: tasks.filter((task) => task.status === "pending").length,
    highPriority: tasks.filter((task) => task.priority === "high").length,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-blue-50 p-2">
        <div className="text-center">
          <p className="text-blue-600 text-sm font-medium">Total Tasks</p>
          <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
        </div>
      </Card>

      <Card className="bg-green-50 p-2">
        <div className="text-center">
          <p className="text-green-600 text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold text-green-700">
            {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </p>
        </div>
      </Card>

      <Card className="bg-red-50 p-2">
        <div className="text-center">
          <p className="text-red-600 text-sm font-medium">High Priority</p>
          <p className="text-3xl font-bold text-red-700">{stats.highPriority}</p>
        </div>
      </Card>
    </div>
  )
}
