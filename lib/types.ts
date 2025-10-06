export type UserRole = "user" | "admin" | "planner"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  category: string
  price: number
  image: string
  location: string
  capacity: number
  featured: boolean
  rating: number
  reviewCount: number
  createdAt: string
}

export interface Booking {
  id: string
  userId: string
  eventId: string
  date: string
  time: string
  urgency: "standard" | "priority" | "urgent"
  status: "pending" | "confirmed" | "cancelled"
  totalPrice: number
  createdAt: string
}

export interface Review {
  id: string
  userId: string
  eventId: string
  bookingId: string
  rating: number
  comment: string
  createdAt: string
}

export interface Testimonial {
  id: string
  userId: string
  userName: string
  userImage: string
  rating: number
  comment: string
  featured: boolean
  createdAt: string
}

export interface Query {
  id: string
  userId: string
  subject: string
  message: string
  status: "open" | "assigned" | "resolved"
  assignedTo?: string
  createdAt: string
}
