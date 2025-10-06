"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

import { useParams } from "next/navigation"

export default function ReviewBookingPage() {
  const params = useParams<{ id: string }>()
  const { user, isLoading } = useAuth()
  const { bookings, events, addReview, reviews } = useData()
  const router = useRouter()
  const { toast } = useToast()
  const [booking, setBooking] = useState(bookings.find((b) => b.id === params.id))
  const [event, setEvent] = useState(booking ? events.find((e) => e.id === booking.eventId) : null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const foundBooking = bookings.find((b) => b.id === params.id)
    setBooking(foundBooking)
    if (foundBooking) {
      setEvent(events.find((e) => e.id === foundBooking.eventId))
    }
  }, [bookings, events, params.id])

  if (isLoading || !user || !booking || !event) {
    return null
  }

  // Check if user already reviewed this event
  const existingReview = reviews.find((r) => r.userId === user.id && r.eventId === event.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a review comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      addReview({
        userId: user.id,
        eventId: event.id,
        rating,
        comment: comment.trim(),
      })

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback",
      })

      router.push("/dashboard/bookings")
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (existingReview) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <Star className="w-16 h-16 text-primary mx-auto mb-4 fill-primary" />
              <h2 className="text-2xl font-bold mb-2">Review Already Submitted</h2>
              <p className="text-muted-foreground mb-6">You have already reviewed this event</p>
              <Link href="/dashboard/bookings">
                <Button>Back to Bookings</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard/bookings">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Bookings
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Leave a Review</CardTitle>
              <p className="text-muted-foreground">Share your experience with this event</p>
            </CardHeader>
            <CardContent>
              {/* Event Info */}
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg mb-8">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.date).toLocaleDateString()} at {booking.time}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating Selection */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Your Rating</Label>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const starValue = index + 1
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoveredRating(starValue)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-12 h-12 transition-colors ${
                              starValue <= (hoveredRating || rating)
                                ? "fill-primary text-primary"
                                : "text-muted hover:text-primary/50"
                            }`}
                          />
                        </button>
                      )
                    })}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {rating === 1 && "Poor"}
                      {rating === 2 && "Fair"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Very Good"}
                      {rating === 5 && "Excellent"}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div className="space-y-3">
                  <Label htmlFor="comment" className="text-lg font-semibold">
                    Your Review
                  </Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this event..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">{comment.length} characters</p>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || rating === 0}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
