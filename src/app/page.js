"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "../lib/redux/hooks"
import LandingPage from "./landingPage"

export default function Home() {
  const router = useRouter()
  const { token } = useAppSelector((state) => state.auth)
  console.log("Home  token-->", token)

  useEffect(() => {
    if (token) {
      router.push("/dashboard")
    }
  }, [token, router])

  return <LandingPage />
}
