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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CalendarIcon, Clock, Zap, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function BookEventPage({ params, searchParams }: { params: { id: string }; searchParams?: { companyId?: string } }) {
  const { user, isLoading } = useAuth()
  const { events, bookings, addBooking, companies, offers } = useData()
  const router = useRouter()
  const { toast } = useToast()
  const [event, setEvent] = useState(events.find((e) => e.id === params.id))
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [urgency, setUrgency] = useState<"standard" | "priority" | "urgent">("standard")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const companyId = searchParams?.companyId
  const selectedCompany = companies.find((c) => c.id === companyId)
  const offer = offers.find((o) => o.eventId === params.id && o.companyId === companyId)

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.push("/")
      return
    }
    // Enforce user-only access; redirect admins/planners to their dashboards
    if (user.role !== "user") {
      router.push(user.role === "admin" ? "/admin" : "/planners")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setEvent(events.find((e) => e.id === params.id))
  }, [events, params.id])

  if (isLoading || !user || !event) {
    return null
  }

  // Prevent duplicate bookings for the same event by the same user
  const alreadyBooked = bookings.some((b) => b.userId === user.id && b.eventId === event.id)
  useEffect(() => {
    if (alreadyBooked) {
      router.push(`/events/${event.id}`)
    }
  }, [alreadyBooked, event.id, router])

  const urgencyOptions = [
    {
      value: "standard",
      label: "Standard",
      description: "Regular booking with standard processing",
      multiplier: 1,
      icon: CheckCircle2,
    },
    {
      value: "priority",
      label: "Priority",
      description: "Faster processing with priority support",
      multiplier: 1.5,
      icon: Clock,
    },
    {
      value: "urgent",
      label: "Urgent",
      description: "Immediate processing with dedicated support",
      multiplier: 2,
      icon: Zap,
    },
  ]

  const selectedUrgencyOption = urgencyOptions.find((opt) => opt.value === urgency)!
  const basePrice = offer ? offer.price : event.price
  const totalPrice = Math.round(basePrice * selectedUrgencyOption.multiplier)

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyId || !selectedCompany) {
      toast({
        title: "Select a company",
        description: "Please choose a company before booking",
        variant: "destructive",
      })
      router.push(`/events/${event.id}/company`)
      return
    }

    if (!date || !time) {
      toast({
        title: "Missing information",
        description: "Please select both date and time",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      addBooking({
        userId: user.id,
        eventId: event.id,
        companyId,
        date: date.toISOString(),
        time,
        urgency,
        status: "pending",
        totalPrice,
      })

      toast({
        title: "Booking confirmed!",
        description: "Your event has been successfully booked",
      })

      router.push("/dashboard/bookings")
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Book Your Event</CardTitle>
                <p className="text-muted-foreground">Complete the details below to confirm your booking</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Company Summary */}
                  {selectedCompany && (
                    <div className="space-y-1">
                      <Label className="text-lg font-semibold">Selected Company</Label>
                      <div className="text-sm">{selectedCompany.name}</div>
                    </div>
                  )}
                  {/* Date Selection */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Select Date
                    </Label>
                    <Card className="border-2">
                      <CardContent className="p-4 flex justify-center">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          className="rounded-md"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Select Time
                    </Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Urgency Selection */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Booking Priority
                    </Label>
                    <RadioGroup value={urgency} onValueChange={(value: any) => setUrgency(value)}>
                      <div className="space-y-3">
                        {urgencyOptions.map((option) => {
                          const Icon = option.icon
                          return (
                            <Card
                              key={option.value}
                              className={`cursor-pointer transition-all ${
                                urgency === option.value
                                  ? "border-primary border-2 bg-primary/5"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => setUrgency(option.value as any)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icon className="w-5 h-5 text-primary" />
                                      <Label htmlFor={option.value} className="text-lg font-semibold cursor-pointer">
                                        {option.label}
                                      </Label>
                                      {option.multiplier > 1 && (
                                        <span className="text-sm text-primary font-medium">
                                          +{Math.round((option.multiplier - 1) * 100)}%
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{option.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl font-bold text-primary">
                                      ${Math.round(event.price * option.multiplier)}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !date || !time}>
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-40 rounded-lg overflow-hidden">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
                  <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">${basePrice}</span>
                  </div>
                  {date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{date.toLocaleDateString()}</span>
                    </div>
                  )}
                  {time && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{time}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Priority</span>
                    <span className="font-medium">{selectedUrgencyOption.label}</span>
                  </div>
                  {selectedUrgencyOption.multiplier > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Priority Fee</span>
                      <span className="font-medium text-primary">
                        +${Math.round(event.price * (selectedUrgencyOption.multiplier - 1))}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-3xl font-bold text-primary">${totalPrice}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
