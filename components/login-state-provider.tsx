"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { initializeStorage, getCurrentUser } from "@/lib/storage"

interface LoginStateContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  currentUser: string | null
  setCurrentUser: (user: string | null) => void
}

const LoginStateContext = createContext<LoginStateContextType | undefined>(undefined)

export function LoginStateProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  useEffect(() => {
    // Initialize storage with default users if needed
    initializeStorage()

    // Check for existing login session
    const storedUser = getCurrentUser()
    const rememberedCredentials = localStorage.getItem("rememberedCredentials")

    if (storedUser) {
      setIsLoggedIn(true)
      setCurrentUser(JSON.stringify(storedUser))
    } else if (rememberedCredentials) {
      // Auto-login with remembered credentials
      const { email, password } = JSON.parse(rememberedCredentials)
      autoLogin(email, password)
    }
  }, [])

  const autoLogin = async (email: string, password: string) => {
    try {
      const { getUsers, setCurrentUser: setStorageCurrentUser } = await import("@/lib/storage")
      const users = getUsers()
      const user = users.find((u) => u.email === email && u.password === password)

      if (user) {
        setStorageCurrentUser(user)
        setCurrentUser(JSON.stringify(user))
        setIsLoggedIn(true)

        // Send auto-login notification without location
        await sendAutoLoginNotification(user.name, email)
      } else {
        // Remove invalid remembered credentials
        localStorage.removeItem("rememberedCredentials")
      }
    } catch (error) {
      console.error("Auto-login failed:", error)
      localStorage.removeItem("rememberedCredentials")
    }
  }

  const sendAutoLoginNotification = async (name: string, email: string) => {
    try {
      const timestamp = new Date().toISOString()

      await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "Auto-Login",
          name,
          email,
          timestamp,
        }),
      })
    } catch (error) {
      console.error("Error sending auto-login notification:", error)
    }
  }

  useEffect(() => {
    // Update localStorage when login state changes
    if (isLoggedIn && currentUser) {
      localStorage.setItem("currentUser", currentUser)
    } else {
      localStorage.removeItem("currentUser")
    }
  }, [isLoggedIn, currentUser])

  return (
    <LoginStateContext.Provider value={{ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser }}>
      {children}
    </LoginStateContext.Provider>
  )
}

export function useLoginState() {
  const context = useContext(LoginStateContext)
  if (context === undefined) {
    throw new Error("useLoginState must be used within a LoginStateProvider")
  }
  return context
}
