"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminReviewsPage() {
  const { user, isLoading } = useAuth()
  const { reviews, events, users, deleteReview } = useData()
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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview(id)
      toast({ title: "Review deleted successfully" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Manage Reviews</h1>
          <p className="text-xl text-muted-foreground">View and moderate event reviews</p>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => {
            const event = events.find((e) => e.id === review.eventId)
            const reviewUser = users.find((u) => u.id === review.userId)
            if (!event || !reviewUser) return null

            return (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{reviewUser.name}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-pretty">{review.comment}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(review.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
