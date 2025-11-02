"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

export default function PlannerRequestsPage() {
  const { user, isLoading } = useAuth()
  const { bookings, updateBooking, events, users, companies } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "planner")) {
      router.push("/planners/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  const myCompanyIds = companies.filter((c) => c.ownerId === user.id).map((c) => c.id)
  const myRequests = bookings.filter((b) => myCompanyIds.includes(b.companyId) && b.status === "pending")

  const handleUpdateRequest = (bookingId: string, status: "confirmed" | "cancelled") => {
    updateBooking(bookingId, { status })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Event Requests</h1>
          <p className="text-xl text-muted-foreground">Manage incoming booking requests for your events.</p>
        </div>

        {myRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              You have no pending event requests.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myRequests.map((booking) => {
              const event = events.find((e) => e.id === booking.eventId)
              const customer = users.find((u) => u.id === booking.userId)
              if (!event || !customer) return null

              return (
                <Card key={booking.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Requested by {customer.name} on {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                      <p className="text-sm font-bold text-primary">Total: ₹{booking.totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateRequest(booking.id, "confirmed")} className="gap-1">
                        <Check className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleUpdateRequest(booking.id, "cancelled")} className="gap-1">
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
