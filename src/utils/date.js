export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date()
}
