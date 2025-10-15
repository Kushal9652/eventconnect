"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Star, Calendar, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useParams } from "next/navigation"

export default function EventDetailPage() {
  const params = useParams<{ id: string }>()
  const { user, isLoading } = useAuth()
  const { events, reviews, bookings } = useData()
  const router = useRouter()
  const [event, setEvent] = useState(events.find((e) => e.id === params.id))

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setEvent(events.find((e) => e.id === params.id))
  }, [events, params.id])

  if (isLoading || !user || !event) {
    return null
  }

  const userHasBooked = bookings.some((b) => b.userId === user.id && b.eventId === event.id)

  const eventReviews = reviews.filter((r) => r.eventId === event.id)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              {event.featured && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Featured</Badge>
              )}
            </div>

            {/* Event Details */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {event.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-semibold">{event.rating}</span>
                  <span className="text-muted-foreground">({event.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-balance">{event.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">{event.description}</p>
            </div>

            {/* Event Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Event Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-muted-foreground">{event.capacity} attendees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Flexible Dates</p>
                      <p className="text-muted-foreground">Choose your preferred date during booking</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            {eventReviews.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Recent Reviews</h2>
                  <div className="space-y-4">
                    {eventReviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground text-pretty">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

            {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-primary">${event.price}</span>
                    <span className="text-muted-foreground">per booking</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Flexible dates and times available</p>
                </div>
                {user.role === "user" && !userHasBooked && (
                  <Link href={`/events/${event.id}/company`}>
                    <Button size="lg" className="w-full mb-4">
                      Choose Company
                    </Button>
                  </Link>
                )}
                {userHasBooked && (
                  <Link href="/dashboard/bookings">
                    <Button size="lg" variant="secondary" className="w-full mb-4">
                      View Your Booking
                    </Button>
                  </Link>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Instant confirmation</span>
                    <span className="font-medium">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Flexible scheduling</span>
                    <span className="font-medium">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Premium support</span>
                    <span className="font-medium">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
