import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch } from "src/lib/redux/hooks"
import Select from "../ui/select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textArea"
import { toast } from "react-toastify"
import { createTask, updateTask } from "src/lib/redux/slice/tasks/task-slice"

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

const taskSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().optional(),
  dueDate: z
    .string()
    .optional()
    .refine((date) => !date || new Date(date) >= new Date(), {
      message: "Due date cannot be in the past",
    }),
  priority: z.enum(["low", "medium", "high"], { required_error: "Priority is required" }),
  status: z.enum(["pending", "in-progress", "completed"], { required_error: "Status is required" }),
})

export default function TaskForm({ task, onClose }) {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      priority: task?.priority || "medium",
      status: task?.status || "pending",
    },
    resolver: zodResolver(taskSchema),
  })

  const onSubmit = async (formData) => {
    console.log("onSubmit  formData-->", formData)
    try {
      if (task?._id) {
        await dispatch(updateTask({ id: task._id, taskData: formData })).unwrap()
      } else {
        await dispatch(createTask(formData)).unwrap()
      }
      toast.success(`${task?._id ? "Updated" : "Created"} task successfully`)
      onClose()
    } catch (error) {
      toast.error("Failed to save task")
      console.error("Failed to save task", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input name="title" {...register("title")} />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" {...register("description")} />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input type="date" name="dueDate" {...register("dueDate")} />
        {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate.message}</p>}
      </div>

      <div>
        <Select label="Priority" name="priority" {...register("priority")} options={priorityOptions} />
        {errors.priority && <p className="mt-1 text-sm text-red-500">{errors.priority.message}</p>}
      </div>

      <div>
        <Select label="Status" name="status" {...register("status")} options={statusOptions} />
        {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : task?._id ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}
