"use client"

import { useEffect, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CompanyDetailPage() {
  const { user, isLoading } = useAuth()
  const { companies, events, offers } = useData()
  const router = useRouter()
  const params = useParams<{ id: string; companyId: string }>()

  const event = useMemo(() => events.find((e) => e.id === params.id), [events, params.id])
  const company = useMemo(() => companies.find((c) => c.id === params.companyId), [companies, params.companyId])
  const offer = useMemo(
    () => offers.find((o) => o.eventId === params.id && o.companyId === params.companyId),
    [offers, params.id, params.companyId],
  )

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

  if (isLoading || !user || !event || !company) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <Link href={`/events/${event.id}/company`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Companies
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {offer?.galleryImages && offer.galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {offer.galleryImages.map((src, i) => (
                      <div key={i} className="relative h-40 rounded-lg overflow-hidden">
                        <Image src={src} alt={`${company.name} ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {offer?.testimonials && offer.testimonials.length > 0 && (
                  <div>
                    <div className="text-xl font-semibold mb-3">Testimonials</div>
                    <div className="space-y-3">
                      {offer.testimonials.map((t) => (
                        <div key={t.id} className="border rounded-md p-3">
                          <div className="flex items-center gap-2 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-primary text-primary" : "text-muted"}`} />
                            ))}
                            <span className="text-sm text-muted-foreground">{t.userName}</span>
                          </div>
                          <div className="text-sm">{t.comment}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {offer?.policies && offer.policies.length > 0 && (
                  <div>
                    <div className="text-xl font-semibold mb-2">Policies</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {offer.policies.map((p, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Offer</CardTitle>
              </CardHeader>
              <CardContent>
                {offer ? (
                  <>
                    <div className="text-muted-foreground mb-2">Price</div>
                    <div className="text-3xl font-bold text-primary mb-4">${offer.price}</div>
                    <Button onClick={() => router.push(`/events/${event.id}/book?companyId=${company.id}`)} className="w-full">
                      Choose {company.name}
                    </Button>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">No offer available for this event.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


