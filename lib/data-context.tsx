"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Event, Booking, Review, Testimonial, Query, User } from "./types"
import { mockEvents, mockTestimonials, mockUsers } from "./mock-data"

interface DataContextType {
  events: Event[]
  bookings: Booking[]
  reviews: Review[]
  testimonials: Testimonial[]
  queries: Query[]
  users: User[]
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  addReview: (review: Omit<Review, "id">) => void
  deleteReview: (id: string) => void
  addEvent: (event: Omit<Event, "id" | "createdAt">) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "createdAt">) => void
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void
  deleteTestimonial: (id: string) => void
  addQuery: (query: Omit<Query, "id" | "createdAt">) => void
  updateQuery: (id: string, updates: Partial<Query>) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [queries, setQueries] = useState<Query[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const storedEvents = localStorage.getItem("eventconnect_events")
    const storedBookings = localStorage.getItem("eventconnect_bookings")
    const storedReviews = localStorage.getItem("eventconnect_reviews")
    const storedTestimonials = localStorage.getItem("eventconnect_testimonials")
    const storedQueries = localStorage.getItem("eventconnect_queries")
    const storedUsers = localStorage.getItem("eventconnect_users")

    setEvents(storedEvents ? JSON.parse(storedEvents) : mockEvents)
    setBookings(storedBookings ? JSON.parse(storedBookings) : [])
    setReviews(storedReviews ? JSON.parse(storedReviews) : [])
    setTestimonials(storedTestimonials ? JSON.parse(storedTestimonials) : mockTestimonials)
    setQueries(storedQueries ? JSON.parse(storedQueries) : [])
    setUsers(storedUsers ? JSON.parse(storedUsers) : mockUsers)
  }, [])

  useEffect(() => {
    localStorage.setItem("eventconnect_events", JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem("eventconnect_bookings", JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    localStorage.setItem("eventconnect_reviews", JSON.stringify(reviews))
  }, [reviews])

  useEffect(() => {
    localStorage.setItem("eventconnect_testimonials", JSON.stringify(testimonials))
  }, [testimonials])

  useEffect(() => {
    localStorage.setItem("eventconnect_queries", JSON.stringify(queries))
  }, [queries])

  useEffect(() => {
    localStorage.setItem("eventconnect_users", JSON.stringify(users))
  }, [users])

  const addBooking = (booking: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [...prev, newBooking])
  }

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const addReview = (reviewData: Omit<Review, "id">) => {
    const newReview: Review = {
      id: `review-${Date.now()}`,
      ...reviewData,
    }
    setReviews([...reviews, newReview])

    const eventReviews = [...reviews, newReview].filter((r) => r.eventId === reviewData.eventId)
    const avgRating = eventReviews.reduce((sum, r) => sum + r.rating, 0) / eventReviews.length
    const eventIndex = events.findIndex((e) => e.id === reviewData.eventId)
    if (eventIndex !== -1) {
      const updatedEvents = [...events]
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: eventReviews.length,
      }
      setEvents(updatedEvents)
    }
  }

  const deleteReview = (id: string) => {
    const review = reviews.find((r) => r.id === id)
    setReviews(reviews.filter((r) => r.id !== id))

    if (review) {
      const eventReviews = reviews.filter((r) => r.eventId === review.eventId && r.id !== id)
      const avgRating =
        eventReviews.length > 0 ? eventReviews.reduce((sum, r) => sum + r.rating, 0) / eventReviews.length : 4.5
      const eventIndex = events.findIndex((e) => e.id === review.eventId)
      if (eventIndex !== -1) {
        const updatedEvents = [...events]
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: eventReviews.length,
        }
        setEvents(updatedEvents)
      }
    }
  }

  const addEvent = (event: Omit<Event, "id" | "createdAt">) => {
    const newEvent: Event = {
      ...event,
      id: `event_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const addTestimonial = (testimonial: Omit<Testimonial, "id" | "createdAt">) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: `testimonial_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setTestimonials((prev) => [...prev, newTestimonial])
  }

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id))
  }

  const addQuery = (query: Omit<Query, "id" | "createdAt">) => {
    const newQuery: Query = {
      ...query,
      id: `query_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setQueries((prev) => [...prev, newQuery])
  }

  const updateQuery = (id: string, updates: Partial<Query>) => {
    setQueries((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        events,
        bookings,
        reviews,
        testimonials,
        queries,
        users,
        addBooking,
        updateBooking,
        addReview,
        deleteReview,
        addEvent,
        updateEvent,
        deleteEvent,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addQuery,
        updateQuery,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
