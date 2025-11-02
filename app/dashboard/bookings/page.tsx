"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, AlertCircle, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BookingsPage() {
  const { user, isLoading } = useAuth()
  const { bookings, events, companies, deleteAllBookings } = useData()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  const userBookings = bookings.filter((b) => b.userId === user.id)

  const handleClearAllBookings = () => {
    if (confirm("Are you sure you want to delete all your bookings? This action cannot be undone.")) {
      setIsDeleting(true)
      deleteAllBookings(user.id)
      setIsDeleting(false)
    }
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

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "Urgent"
      case "priority":
        return "Priority"
      default:
        return "Standard"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
              <p className="text-xl text-muted-foreground">Manage your event reservations</p>
            </div>
            {userBookings.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAllBookings}
                disabled={isDeleting}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Clearing..." : "Clear All"}
              </Button>
            )}
          </div>
        </div>

        {userBookings.length > 0 ? (
          <div className="space-y-4">
            {userBookings.map((booking) => {
              const event = events.find((e) => e.id === booking.eventId)
              const company = companies.find((c) => c.id === booking.companyId)
              if (!event) return null

              return (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                            <p className="text-sm text-muted-foreground mb-1">Urgency</p>
                            <span className="font-medium">{getUrgencyLabel(booking.urgency)}</span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Total</p>
                            <span className="font-bold text-primary">₹{booking.totalPrice.toLocaleString()}</span>
                          </div>
                          {company && (
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground mb-1">Company</p>
                              <span className="font-medium">{company.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/events/${event.id}`}>
                            <Button variant="outline" size="sm">
                              View Event
                            </Button>
                          </Link>
                          {booking.status === "confirmed" && (
                            <Link href={`/dashboard/bookings/${booking.id}/review`}>
                              <Button size="sm">Leave Review</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">Start exploring events and make your first booking</p>
              <Link href="/dashboard">
                <Button>Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
