import type { Event, Testimonial, User, Company, EventCompanyOffer } from "./types"

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Traditional Indian Wedding",
    description:
      "A grand shaadi experience with mandap decor, pheras, live dhol, and curated catering.",
    category: "Wedding",
    price: 85000,
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
    price: 35000,
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
    price: 45000,
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
    price: 30000,
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
    price: 75000,
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
    price: 40000,
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

export const mockCompanies: Company[] = [
  {
    id: "c1",
    name: "ABC Company",
    description: "Full-service event planning and management",
    logo: "/placeholder-logo.png",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "c2",
    name: "Yellow Company",
    description: "Creative decor and experiential design",
    logo: "/placeholder-logo.png",
    createdAt: "2024-01-05T10:00:00Z",
  },
  {
    id: "c3",
    name: "Blue Events",
    description: "Corporate events and conferences",
    logo: "/placeholder-logo.png",
    createdAt: "2024-01-10T10:00:00Z",
  },
]

export const mockEventCompanyOffers: EventCompanyOffer[] = [
  // Event 1 offers
  {
    id: "o1",
    eventId: "1",
    companyId: "c1",
    price: 85000,
    galleryImages: [
      "/sunset-beach-wedding-romantic-ceremony.jpg",
      "/elegant-garden-party-outdoor-celebration.jpg",
    ],
    policies: ["50% advance", "Full refund 30 days prior", "No pets allowed"],
    testimonials: [
      { id: "t1", userName: "Aarav", comment: "Flawless wedding execution!", rating: 5 },
    ],
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "o2",
    eventId: "1",
    companyId: "c2",
    price: 80000,
    galleryImages: [
      "/art-gallery-opening-contemporary-exhibition.jpg",
      "/corporate-team-building-activities-professional.jpg",
    ],
    policies: ["40% advance", "Reschedule allowed once", "Decor damages billed"],
    testimonials: [
      { id: "t2", userName: "Diya", comment: "Creative decor and great team!", rating: 5 },
    ],
    createdAt: "2024-03-02T10:00:00Z",
  },
  {
    id: "o3",
    eventId: "1",
    companyId: "c3",
    price: 90000,
    galleryImages: [
      "/professional-woman-portrait.png",
      "/professional-woman-smiling.png",
    ],
    policies: ["60% advance", "Non-refundable within 15 days", "Outdoor after 10PM not allowed"],
    testimonials: [
      { id: "t3", userName: "Kabir", comment: "Professional and on-time delivery.", rating: 4 },
    ],
    createdAt: "2024-03-03T10:00:00Z",
  },
  // Event 2 offers
  {
    id: "o4",
    eventId: "2",
    companyId: "c1",
    price: 35000,
    galleryImages: [
      "/elegant-garden-party-outdoor-celebration.jpg",
    ],
    policies: ["Advance 30%", "Full refund 7 days prior"],
    testimonials: [
      { id: "t4", userName: "Meera", comment: "Perfect birthday setup!", rating: 5 },
    ],
    createdAt: "2024-03-04T10:00:00Z",
  },
  {
    id: "o5",
    eventId: "2",
    companyId: "c2",
    price: 32000,
    galleryImages: [
      "/art-gallery-opening-contemporary-exhibition.jpg",
    ],
    policies: ["Advance 40%", "Reschedule with fee"],
    testimonials: [
      { id: "t5", userName: "Riya", comment: "Loved the theme!", rating: 4 },
    ],
    createdAt: "2024-03-05T10:00:00Z",
  },
]
