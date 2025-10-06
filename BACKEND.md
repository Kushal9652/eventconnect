## EventConnect Backend Architecture (Current)

This project currently runs without a real server backend. All data and authentication are managed on the client using React Context and browser localStorage. The following summarizes the architecture, data flow, and how to evolve it into a production backend.

### High-Level Overview
- Auth and data are provided via two React Context providers configured in `app/layout.tsx`:
  - `AuthProvider` from `lib/auth-context.tsx`
  - `DataProvider` from `lib/data-context.tsx`
- Mock seed data lives in `lib/mock-data.ts` and is loaded on first run into localStorage.
- All CRUD operations update React state and persist to localStorage. There are no API routes or databases in the current setup.

### Authentication (`lib/auth-context.tsx`)
- Stores the current user in state and mirrors it to `localStorage` under key `eventconnect_user`.
- Login behavior:
  - Accepts a hardcoded admin credential: `admin@eventconnect.com` / `admin123` (user comes from `mockUsers[0]`).
  - Otherwise, looks up the email in `eventconnect_users` from `localStorage`. If found, logs in without verifying password (demo-only behavior).
- Signup behavior:
  - Creates a new `User` with role `user`, stores it in `eventconnect_users` and sets it as the current session.
- Logout clears `eventconnect_user`.
- User shape is defined in `lib/types.ts` (`UserRole` is currently `"user" | "admin"`).

Important demo limitations:
- Passwords are not validated or stored; do not use real credentials.
- No session tokens, no server, no CSRF protection. This is strictly for prototyping.

### Application Data (`lib/data-context.tsx`)
- Holds primary entities in React state: `events`, `bookings`, `reviews`, `testimonials`, `queries`, `users`.
- On load, hydrates each collection from `localStorage`, falling back to `mock-data.ts` for `events`, `testimonials`, and `users`.
- Persists changes back to `localStorage` using `useEffect` for each collection.
- Provides CRUD-style helpers:
  - `addBooking`, `updateBooking`
  - `addReview`, `deleteReview` (also recomputes `Event.rating` and `reviewCount`)
  - `addEvent`, `updateEvent`, `deleteEvent`
  - `addTestimonial`, `updateTestimonial`, `deleteTestimonial`
  - `addQuery`, `updateQuery`
  - `updateUser`, `deleteUser`

### Mock Data (`lib/mock-data.ts`)
- `mockEvents`: seed events with images from `public/`.
- `mockTestimonials`: seed testimonials that render in the landing page.
- `mockUsers`: includes a single admin user. Additional users are created at signup and stored in `localStorage`.

### Where Data Is Used
- Landing page `app/page.tsx` pulls `events` and `testimonials` from `DataProvider` and renders sections like Featured Events and Testimonials.
- Other pages under `app/dashboard/` and `app/events/` read/write via `useData()` for bookings and reviews.

### Adding a Real Backend (Future Plan)
To move to production-grade:
1. Introduce API routes under `app/api/*` (Next.js Route Handlers) for auth and CRUD on events/bookings/etc.
2. Add a database (e.g., Postgres via Prisma) and migrate data models from `lib/types.ts`.
3. Replace `AuthProvider` with an auth solution (NextAuth.js, Clerk, or custom JWT) and remove hardcoded credentials.
4. Replace `DataProvider` writes with `fetch` calls to API routes, with optimistic UI if desired.
5. Implement proper password hashing, input validation, and access control (RBAC) in API routes.

This document describes the current prototype-only backend and the path to a robust implementation.


