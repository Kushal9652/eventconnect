"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Star, MessageSquare, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const { events, bookings, users, reviews, testimonials } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "admin") {
    return null
  }

  const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.totalPrice, 0) || 0
  const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0
  const averageRating = reviews?.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  const stats = [
    {
      title: "Total Events",
      value: events?.length || 0,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      link: "/admin/events",
    },
    {
      title: "Total Bookings",
      value: confirmedBookings,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      link: "/admin/bookings",
    },
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      link: "/admin/users",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
      link: "/admin/bookings",
    },
    {
      title: "Average Rating",
      value: averageRating.toFixed(1),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      link: "/admin/reviews",
    },
    {
      title: "Testimonials",
      value: testimonials?.length || 0,
      icon: MessageSquare,
      color: "text-pink-600",
      bgColor: "bg-pink-500/10",
      link: "/admin/testimonials",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">Manage your event platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/events">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                  <Calendar className="w-6 h-6" />
                  <span>Manage Events</span>
                </Button>
              </Link>
              <Link href="/admin/bookings">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                  <TrendingUp className="w-6 h-6" />
                  <span>View Bookings</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                  <Users className="w-6 h-6" />
                  <span>Manage Users</span>
                </Button>
              </Link>
              <Link href="/admin/testimonials">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                  <MessageSquare className="w-6 h-6" />
                  <span>Testimonials</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
