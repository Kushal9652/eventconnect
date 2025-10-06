"use client"

import { Sparkles } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold text-foreground">EventConnect</span>
        </div>
        <p className="text-sm">© 2025 EventConnect. All rights reserved.</p>
      </div>
    </footer>
  )
}


