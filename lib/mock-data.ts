import type { Event, Testimonial, User } from "./types"

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Traditional Indian Wedding",
    description:
      "A grand shaadi experience with mandap decor, pheras, live dhol, and curated catering.",
    category: "Wedding",
    price: 250000,
    image: "/sunset-beach-wedding-romantic-ceremony.jpg",
    location: "Palace Grounds, Bengaluru",
    capacity: 500,
    featured: true,
    rating: 4.9,
    reviewCount: 127,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Birthday Celebration Package",
    description:
      "Custom birthday decor, cake, photographer, and music for intimate gatherings.",
    category: "Birthday",
    price: 25000,
    image: "/elegant-garden-party-outdoor-celebration.jpg",
    location: "Koramangala, Bengaluru",
    capacity: 60,
    featured: true,
    rating: 4.8,
    reviewCount: 89,
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "3",
    title: "Engagement & Haldi Ceremony",
    description:
      "Vibrant haldi setup with marigold decor, live dhol, and candid photography.",
    category: "Ceremony",
    price: 60000,
    image: "/art-gallery-opening-contemporary-exhibition.jpg",
    location: "JP Nagar, Bengaluru",
    capacity: 150,
    featured: true,
    rating: 4.8,
    reviewCount: 234,
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "4",
    title: "Baby Shower (Seemantham)",
    description:
      "Traditional seemantham with floral backdrop, return gifts, and light music.",
    category: "Ceremony",
    price: 45000,
    image: "/elegant-garden-party-outdoor-celebration.jpg",
    location: "Hyderabad",
    capacity: 120,
    featured: false,
    rating: 4.7,
    reviewCount: 56,
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "5",
    title: "Sangeet Night",
    description:
      "Dance floor, DJ, stage lighting, and choreographer for a fun sangeet night.",
    category: "Wedding",
    price: 90000,
    image: "/corporate-team-building-activities-professional.jpg",
    location: "Mumbai",
    capacity: 300,
    featured: false,
    rating: 4.6,
    reviewCount: 143,
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "6",
    title: "Candid Wedding Photography",
    description:
      "Professional candid + traditional photography and cinematic videography package.",
    category: "Photography",
    price: 120000,
    image: "/professional-woman-portrait.png",
    location: "Chennai",
    capacity: 50,
    featured: false,
    rating: 4.8,
    reviewCount: 67,
    createdAt: "2024-02-20T10:00:00Z",
  },
]

export const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Sarah Mitchell",
    userImage: "/professional-woman-portrait.png",
    rating: 5,
    comment:
      "EventConnect made planning our corporate gala effortless. The attention to detail and seamless booking process exceeded all expectations.",
    featured: true,
    createdAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Michael Chen",
    userImage: "/professional-man-portrait.png",
    rating: 5,
    comment:
      "Our beach wedding was absolutely perfect. The team handled everything with such professionalism and care. Highly recommended!",
    featured: true,
    createdAt: "2024-02-05T10:00:00Z",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Emily Rodriguez",
    userImage: "/professional-woman-smiling.png",
    rating: 5,
    comment:
      "The Tech Summit was incredibly well-organized. From registration to execution, everything was flawless. Will definitely book again.",
    featured: true,
    createdAt: "2024-02-12T10:00:00Z",
  },
  {
    id: "4",
    userId: "user4",
    userName: "David Thompson",
    userImage: "/business-professional-portrait.png",
    rating: 4,
    comment: "Great experience overall. The platform is intuitive and the event coordination was top-notch.",
    featured: false,
    createdAt: "2024-02-18T10:00:00Z",
  },
]

export const mockUsers: User[] = [
  {
    id: "admin1",
    email: "admin@eventconnect.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "planner1",
    email: "planner@eventconnect.com",
    name: "Planner User",
    role: "planner",
    createdAt: "2024-01-02T10:00:00Z",
  },
]
