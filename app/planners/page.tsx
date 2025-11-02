"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImagePicker from "@/components/ui/image-picker"

export default function CompanyDashboardPage() {
  const { user, isLoading, login, signup } = useAuth()
  const { events, companies, addCompany, addEvent, deleteEvent } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user && user.role !== "planner" && user.role !== "admin") {
      // non-planner users shouldn't access company dashboard
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) return null

  // Unauthenticated: show login + register (company) flows
  const [showLogin, setShowLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("") // user full name for signup

  // Company form for registration (when signing up)
  const [companyName, setCompanyName] = useState("")
  const [companyDesc, setCompanyDesc] = useState("")

  const [eventForm, setEventForm] = useState({ title: "", price: "", location: "", capacity: "", image: "", description: "" })
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")

  const handleLogin = async () => {
    const ok = await login(email, password)
    if (!ok) {
      alert("Login failed")
    }
  }

  const handleRegisterCompany = async () => {
    // create planner user first
    const ok = await signup(email, password, name, "planner")
    if (!ok) {
      alert("Signup failed (email may already exist)")
      return
    }
    // now user is set in auth context; retrieve user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("eventconnect_user") || "null")
    const ownerId = storedUser?.id
    addCompany({ name: companyName, description: companyDesc, logo: "/placeholder-logo.png", ownerId })
    // reset
    setCompanyName("")
    setCompanyDesc("")
  }

  // Company owner actions
  const myCompanies = user ? companies.filter((c) => c.ownerId === user.id) : []

  const handleCreateEvent = (companyId: string) => {
    if (!eventForm.title || !eventForm.price) return
    addEvent({
      title: eventForm.title,
      description: eventForm.description,
      category: "General",
      price: Number(eventForm.price),
      image: eventForm.image || "/placeholder-logo.png",
      location: eventForm.location || "",
      capacity: Number(eventForm.capacity) || 50,
      featured: false,
      rating: 4.5,
      reviewCount: 0,
      plannerId: user?.id,
      companyId,
    })
    setEventForm({ title: "", price: "", location: "", capacity: "", image: "", description: "" })
  }

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id)
  }

  // If not logged in, show auth UI
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Company Portal</h1>
            <p className="text-xl text-muted-foreground">Manage your events and reach more customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Login Card */}
            {showLogin && (
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                  <CardTitle className="text-2xl">Sign In</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Access your company dashboard</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <Input 
                      id="login-email"
                      type="email"
                      placeholder="your@company.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password"
                      type="password" 
                      placeholder="••••••••"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </div>
                  <Button className="w-full" onClick={handleLogin} size="lg">Sign In</Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account? 
                    <button
                      type="button"
                      onClick={() => {
                        setShowLogin(false)
                        setEmail("")
                        setPassword("")
                        setName("")
                      }}
                      className="text-primary hover:underline font-medium ml-1"
                    >
                      Create one
                    </button>
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Register Card */}
            {!showLogin && (
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Register your company and start creating events</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name"
                      type="text"
                      placeholder="Your Name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input 
                      id="signup-email"
                      type="email"
                      placeholder="your@company.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password"
                      type="password" 
                      placeholder="••••••••"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="font-medium">Company Name</Label>
                    <Input 
                      id="company-name"
                      type="text"
                      placeholder="Your Company" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-desc">Company Description</Label>
                    <Input 
                      id="company-desc"
                      type="text"
                      placeholder="What does your company do?" 
                      value={companyDesc} 
                      onChange={(e) => setCompanyDesc(e.target.value)} 
                    />
                  </div>
                  <Button className="w-full" onClick={handleRegisterCompany} size="lg">Create Company & Account</Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account? 
                    <button
                      type="button"
                      onClick={() => {
                        setShowLogin(true)
                        setEmail("")
                        setPassword("")
                        setCompanyName("")
                        setCompanyDesc("")
                      }}
                      className="text-primary hover:underline font-medium ml-1"
                    >
                      Sign in
                    </button>
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Placeholder on other side */}
            {showLogin && (
              <Card className="border-2 border-dashed flex items-center justify-center">
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">New to EventConnect?</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowLogin(false)
                      setEmail("")
                      setPassword("")
                    }}
                  >
                    Create an Account
                  </Button>
                </div>
              </Card>
            )}

            {!showLogin && (
              <Card className="border-2 border-dashed flex items-center justify-center">
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Already registered?</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowLogin(true)
                      setCompanyName("")
                      setCompanyDesc("")
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    )
  }

  // Logged in company owner dashboard
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Company Dashboard</h1>
          <p className="text-xl text-muted-foreground">Welcome, {user.name}! Manage your companies and events</p>
        </div>

        {myCompanies.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-8 text-center">
              <p className="text-muted-foreground mb-4">You don't own any companies yet. Create one to get started!</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {myCompanies.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{c.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Create Event Section */}
                <div className="mb-8 p-4 bg-secondary/30 rounded-lg border">
                  <h4 className="font-semibold mb-4 text-lg">Create New Event</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input 
                        placeholder="Event title" 
                        value={eventForm.title} 
                        onChange={(e) => setEventForm((s) => ({ ...s, title: e.target.value }))} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Price (₹)</Label>
                      <Input 
                        placeholder="Price" 
                        value={eventForm.price} 
                        onChange={(e) => setEventForm((s) => ({ ...s, price: e.target.value }))} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Location</Label>
                      <Input 
                        placeholder="Location" 
                        value={eventForm.location} 
                        onChange={(e) => setEventForm((s) => ({ ...s, location: e.target.value }))} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Capacity</Label>
                      <Input 
                        placeholder="Capacity" 
                        value={eventForm.capacity} 
                        onChange={(e) => setEventForm((s) => ({ ...s, capacity: e.target.value }))} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Image</Label>
                      {/* ImagePicker: allow URL, upload, or choose from gallery */}
                      <ImagePicker
                        value={eventForm.image}
                        onChange={(v: string) => setEventForm((s) => ({ ...s, image: v }))}
                        suggestions={events.map((e) => e.image).filter((s): s is string => Boolean(s))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input 
                        placeholder="Brief description" 
                        value={eventForm.description} 
                        onChange={(e) => setEventForm((s) => ({ ...s, description: e.target.value }))} 
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleCreateEvent(c.id)} className="mt-4 w-full md:w-auto">Create Event</Button>
                </div>

                {/* Events List */}
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Events</h4>
                  {events.filter((ev) => ev.companyId === c.id).length === 0 ? (
                    <p className="text-muted-foreground py-4">No events created yet for this company</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {events.filter((ev) => ev.companyId === c.id).map((ev) => (
                        <div key={ev.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-secondary/30 transition-colors">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{ev.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{ev.location}</p>
                            <p className="text-xs text-muted-foreground">₹{ev.price.toLocaleString()}</p>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(ev.id)}>Delete</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}



