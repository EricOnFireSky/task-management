import { Input } from "../ui/input"
import Select from "../ui/select"

export default function TaskFilters({ filters, onFilterChange }) {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ]

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

  const sortOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
    { value: "title", label: "Title" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
      />

      <Select
        options={statusOptions}
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
      />

      <Select
        options={priorityOptions}
        value={filters.priority}
        onChange={(e) => onFilterChange("priority", e.target.value)}
      />

      <Select options={sortOptions} value={filters.sortBy} onChange={(e) => onFilterChange("sortBy", e.target.value)} />
    </div>
  )
}
