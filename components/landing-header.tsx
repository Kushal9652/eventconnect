"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { AuthDialog } from "./auth-dialog"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"

export function LandingHeader() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  const handleDashboard = () => {
    if (user?.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold">EventConnect</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/planners")}>Companies</Button>
            {user ? (
              <>
                <Button variant="ghost" onClick={handleDashboard}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleAuthClick("login")}>
                  Sign In
                </Button>
                <Button onClick={() => handleAuthClick("signup")}>Get Started</Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} />
    </>
  )
}
