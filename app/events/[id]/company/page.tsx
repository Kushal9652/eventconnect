"use client"

import { useEffect, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SelectCompanyPage() {
  const { user, isLoading } = useAuth()
  const { companies, events, offers } = useData()
  const router = useRouter()
  const params = useParams<{ id: string }>()

  const event = useMemo(() => events.find((e) => e.id === params.id), [events, params.id])

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.push("/")
      return
    }
    if (user.role !== "user") {
      router.push(user.role === "admin" ? "/admin" : "/planners")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || !event) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <Link href={`/events/${event.id}`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Event
          </Button>
        </Link>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select a Company</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.length === 0 && (
                <div className="col-span-full text-sm text-muted-foreground">No companies available yet.</div>
              )}
              {companies.map((c) => {
                const offer = offers.find((o) => o.eventId === event.id && o.companyId === c.id)
                return (
                  <Card key={c.id} className="p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-lg font-semibold mb-1">{c.name}</div>
                      <div className="text-sm">
                        <div className="text-muted-foreground">{c.description}</div>
                        <div className="mt-2 font-semibold text-primary">
                          {offer ? `₹${offer.price.toLocaleString()}` : "No offer for this event"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" onClick={() => router.push(`/events/${event.id}/company/${c.id}`)}>
                        View Details
                      </Button>
                      <Button disabled={!offer} onClick={() => router.push(`/events/${event.id}/book?companyId=${c.id}`)}>
                        {offer ? `Choose ${c.name}` : "Unavailable"}
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


