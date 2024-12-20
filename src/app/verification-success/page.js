"use client"

import React, { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const VerificationSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      localStorage.setItem("token", token)

      router.push("/dashboard")
    } else {
      console.error("Token not found in the URL.")
    }
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Verification Successful</h1>
        <p className="text-gray-700">Redirecting to your dashboard...</p>
        <div className="mt-6">
          <svg
            className="animate-spin h-6 w-6 text-green-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4zm2 5.292A7.992 7.992 0 014 12h2v5.292z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default VerificationSuccessPage
