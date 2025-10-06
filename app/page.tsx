"use client"

import { LandingHeader } from "@/components/landing-header"
import { EventCard } from "@/components/event-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import { ArrowRight, Calendar, Shield, Sparkles, Star, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const { events, testimonials } = useData()
  const featuredEvents = events.filter((e) => e.featured).slice(0, 3)
  const featuredTestimonials = testimonials.filter((t) => t.featured)

  return (
    <div className="min-h-screen">
      <LandingHeader />

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary opacity-0 animate-fade-in-up">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Premium Event Experiences</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance opacity-0 animate-fade-in-up animation-delay-200">
                Discover Events
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  That Inspire
                </span>
              </h1>

              <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-0 animate-fade-in-up animation-delay-400">
                From elegant galas to intimate gatherings, EventConnect brings you curated experiences that create
                lasting memories.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 opacity-0 animate-fade-in-up animation-delay-600">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 group relative overflow-hidden">
                    <span className="relative z-10">Explore Events</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="gap-2 group bg-transparent">
                    Learn More
                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 opacity-0 animate-fade-in-up animation-delay-800">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Events</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>

            {/* Right image with floating effect */}
            <div className="relative opacity-0 animate-scale-in animation-delay-400">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 z-10" />
                <Image
                  src="/luxury-gala-evening-elegant-ballroom.jpg"
                  alt="Premium Event Experience"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Floating cards */}
                <div className="absolute top-6 right-6 bg-card/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl z-20 animate-fade-in animation-delay-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Easy Booking</div>
                      <div className="text-xs text-muted-foreground">In 3 simple steps</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-card/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl z-20 animate-fade-in animation-delay-800">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <Star className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Trusted by 10,000+ users</div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground text-pretty">
                Seamless booking process with flexible date and time selection
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Events</h3>
              <p className="text-muted-foreground text-pretty">Handpicked premium events across multiple categories</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Platform</h3>
              <p className="text-muted-foreground text-pretty">Secure bookings with verified event organizers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Events</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Explore our handpicked selection of exceptional experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Join thousands of satisfied customers who trust EventConnect
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Create your account today and start booking exceptional events
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Get Started Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Global footer now comes from RootLayout */}
    </div>
  )
}
