import type { Event } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full group">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {event.featured && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">Featured</Badge>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {event.category}
            </Badge>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-medium">{event.rating}</span>
              <span className="text-muted-foreground">({event.reviewCount})</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-balance">{event.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 text-pretty">{event.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{event.capacity}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="flex items-center justify-between w-full">
            <span className="text-2xl font-bold text-primary">${event.price}</span>
            <span className="text-sm text-muted-foreground">per booking</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
