"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"
import { mockUsers } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("eventconnect_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check for admin login
    if (email === "admin@eventconnect.com" && password === "admin123") {
      const adminUser = mockUsers.find((u) => u.role === "admin")!
      setUser(adminUser)
      localStorage.setItem("eventconnect_user", JSON.stringify(adminUser))
      return true
    }

    // Planner demo login
    if (email === "planner@eventconnect.com" && password === "planner123") {
      const plannerUser = mockUsers.find((u) => u.role === "planner")!
      setUser(plannerUser)
      localStorage.setItem("eventconnect_user", JSON.stringify(plannerUser))
      return true
    }

    // Check for existing user in localStorage
    const users = JSON.parse(localStorage.getItem("eventconnect_users") || "[]")
    const existingUser = users.find((u: User) => u.email === email)

    if (existingUser) {
      setUser(existingUser)
      localStorage.setItem("eventconnect_user", JSON.stringify(existingUser))
      return true
    }

    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("eventconnect_users") || "[]")
    if (users.some((u: User) => u.email === email)) {
      return false
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("eventconnect_users", JSON.stringify(users))
    setUser(newUser)
    localStorage.setItem("eventconnect_user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("eventconnect_user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
