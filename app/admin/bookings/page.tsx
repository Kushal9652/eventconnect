"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminBookingsPage() {
  const { user, isLoading } = useAuth()
  const { bookings, events, users, updateBooking } = useData()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "admin") {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleStatusChange = (bookingId: string, newStatus: "confirmed" | "pending" | "cancelled") => {
    updateBooking(bookingId, { status: newStatus })
    toast({ title: `Booking ${newStatus}` })
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Manage Bookings</h1>
          <p className="text-xl text-muted-foreground">View and manage all event bookings</p>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => {
            const event = events.find((e) => e.id === booking.eventId)
            const bookingUser = users.find((u) => u.id === booking.userId)
            if (!event || !bookingUser) return null

            return (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>
                              {bookingUser.name} ({bookingUser.email})
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Date</p>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Time</p>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium">{booking.time}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Location</p>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-medium">{event.location}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total</p>
                          <span className="font-bold text-primary text-lg">${booking.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex lg:flex-col gap-2">
                      <Button
                        size="sm"
                        variant={booking.status === "confirmed" ? "default" : "outline"}
                        onClick={() => handleStatusChange(booking.id, "confirmed")}
                        disabled={booking.status === "confirmed"}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant={booking.status === "pending" ? "default" : "outline"}
                        onClick={() => handleStatusChange(booking.id, "pending")}
                        disabled={booking.status === "pending"}
                      >
                        Pending
                      </Button>
                      <Button
                        size="sm"
                        variant={booking.status === "cancelled" ? "destructive" : "outline"}
                        onClick={() => handleStatusChange(booking.id, "cancelled")}
                        disabled={booking.status === "cancelled"}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
