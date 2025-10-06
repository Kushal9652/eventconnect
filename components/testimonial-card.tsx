import type { Testimonial } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < testimonial.rating ? "fill-primary text-primary" : "text-muted"}`}
            />
          ))}
        </div>
        <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">{testimonial.comment}</p>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={testimonial.userImage || "/placeholder.svg"}
              alt={testimonial.userName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{testimonial.userName}</p>
            <p className="text-sm text-muted-foreground">Verified Customer</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
