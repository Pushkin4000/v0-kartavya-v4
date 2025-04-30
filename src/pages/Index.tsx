"use client"

import { useEffect } from "react"
import { Navigate } from "react-router-dom"

// This is just a wrapper that redirects to the appropriate page
const Index = () => {
  useEffect(() => {
    // Log that the app has started
    console.log("Kartavya application started")
  }, [])

  return <Navigate to="/" replace />
}

export default Index
