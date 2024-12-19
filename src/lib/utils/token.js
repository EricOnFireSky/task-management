export const getStoredToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export const setStoredToken = (token) => {
  localStorage.setItem("token", token)
}

export const removeStoredToken = () => {
  localStorage.removeItem("token")
}
