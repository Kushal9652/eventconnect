"use client"

import { useState } from "react"

type GalleryPickerProps = {
  label?: string
  value: string[]
  onChange: (v: string[]) => void
  suggestions?: string[]
}

export default function GalleryPicker({ label, value, onChange, suggestions = [] }: GalleryPickerProps) {
  const [local, setLocal] = useState<string[]>(value || [])

  const handleFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = String(e.target?.result || "")
      const next = [...local, result]
      setLocal(next)
      onChange(next)
    }
    reader.readAsDataURL(file)
  }

  const removeAt = (i: number) => {
    const next = local.filter((_, idx) => idx !== i)
    setLocal(next)
    onChange(next)
  }

  const pickSuggestion = (s: string) => {
    const next = [...local, s]
    setLocal(next)
    onChange(next)
  }

  return (
    <div>
      {label && <label className="text-sm mb-1 block">{label}</label>}
      <div className="flex gap-2 mb-2">
        <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      <div className="mb-2 grid grid-cols-4 gap-2">
        {suggestions.map((s, i) => (
          <button key={i} type="button" className="h-20 w-full rounded overflow-hidden border" onClick={() => pickSuggestion(s)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s} alt={`suggestion-${i}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {local.map((s, i) => (
          <div key={i} className="relative h-28 w-full rounded overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s} alt={`local-${i}`} className="h-full w-full object-cover" />
            <button type="button" onClick={() => removeAt(i)} className="absolute top-1 right-1 bg-white/80 rounded px-1 text-xs">Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
