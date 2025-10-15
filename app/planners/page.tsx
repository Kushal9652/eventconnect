"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PlannerDashboardPage() {
  const { user, isLoading } = useAuth()
  const { bookings, events, companies, updateBooking } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/planner-login")
      } else if (user.role !== "planner" && user.role !== "admin") {
        router.push("/")
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  const pendingBookings = bookings.filter((b) => b.status === "pending")

  const acceptBooking = (id: string) => updateBooking(id, { status: "confirmed" })
  const rejectBooking = (id: string) => updateBooking(id, { status: "cancelled" })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Planner Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingBookings.length === 0 ? (
              <p className="text-muted-foreground">No pending bookings right now.</p>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((b) => {
                  const ev = events.find((e) => e.id === b.eventId)!
                  const company = companies.find((c) => c.id === b.companyId)
                  return (
                    <div key={b.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{ev?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(b.date).toLocaleDateString()} • {b.time} • ₹{b.totalPrice}
                        </p>
                        {company && <p className="text-xs text-muted-foreground">Company: {company.name}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => rejectBooking(b.id)}>Reject</Button>
                        <Button onClick={() => acceptBooking(b.id)}>Accept</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}



