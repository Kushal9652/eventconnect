"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminOffersPage() {
  const { user, isLoading } = useAuth()
  const { events, companies, offers, addOffer, updateOffer, deleteOffer } = useData()
  const router = useRouter()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ eventId: "", companyId: "", price: 0, galleryImages: "", policies: "", testimonials: "" })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "admin") return null

  const openCreate = () => {
    setEditingId(null)
    setFormData({ eventId: "", companyId: "", price: 0, galleryImages: "", policies: "", testimonials: "" })
    setIsDialogOpen(true)
  }

  const onEdit = (id: string) => {
    const o = offers.find((x) => x.id === id)
    if (!o) return
    setEditingId(id)
    setFormData({
      eventId: o.eventId,
      companyId: o.companyId,
      price: o.price,
      galleryImages: (o.galleryImages || []).join("\n"),
      policies: (o.policies || []).join("\n"),
      testimonials: (o.testimonials || []).map((t) => `${t.userName}|${t.rating}|${t.comment}`).join("\n"),
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const galleryImages = formData.galleryImages
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    const policies = formData.policies
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    const testimonials = formData.testimonials
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        const [userName, ratingStr, comment] = line.split("|")
        return { id: `t_${Date.now()}_${i}`, userName: userName?.trim() || "", rating: Number(ratingStr) || 5, comment: comment?.trim() || "" }
      })

    const payload = {
      eventId: formData.eventId,
      companyId: formData.companyId,
      price: Number(formData.price) || 0,
      galleryImages,
      policies,
      testimonials,
    }

    if (editingId) {
      updateOffer(editingId, payload)
      toast({ title: "Offer updated" })
    } else {
      addOffer(payload)
      toast({ title: "Offer created" })
    }

    setIsDialogOpen(false)
    setEditingId(null)
  }

  const onDelete = (id: string) => {
    if (!confirm("Delete this offer?")) return
    deleteOffer(id)
    toast({ title: "Offer deleted" })
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2">Offers</h1>
            <p className="text-xl text-muted-foreground">Manage per-event company offers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Offer" : "Create Offer"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event</Label>
                    <Select value={formData.eventId} onValueChange={(v) => setFormData({ ...formData, eventId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Select value={formData.companyId} onValueChange={(v) => setFormData({ ...formData, companyId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Price</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Gallery Images (one URL per line)</Label>
                  <Textarea rows={3} value={formData.galleryImages} onChange={(e) => setFormData({ ...formData, galleryImages: e.target.value })} />
                </div>
                <div>
                  <Label>Policies (one per line)</Label>
                  <Textarea rows={3} value={formData.policies} onChange={(e) => setFormData({ ...formData, policies: e.target.value })} />
                </div>
                <div>
                  <Label>Testimonials (format: Name|Rating|Comment per line)</Label>
                  <Textarea rows={4} value={formData.testimonials} onChange={(e) => setFormData({ ...formData, testimonials: e.target.value })} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">{editingId ? "Update" : "Create"}</Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((o) => {
            const e = events.find((x) => x.id === o.eventId)
            const c = companies.find((x) => x.id === o.companyId)
            if (!e || !c) return null
            return (
              <Card key={o.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-sm text-muted-foreground">{c.name}</div>
                  <div className="text-primary font-bold">₹{o.price.toLocaleString()}</div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(o.id)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDelete(o.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}


