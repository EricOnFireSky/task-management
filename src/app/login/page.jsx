"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import LoginForm from "../components/auth/LoginForm"

export default function LoginPage() {
  const router = useRouter()
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      router.push("/dashboard")
    }
  }, [token, router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h1>
        <p className="mt-2 text-center text-sm text-gray-600">Welcome back to Task Management</p>
      </div>
      <LoginForm />
    </div>
  )
}
