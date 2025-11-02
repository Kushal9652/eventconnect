"use client"

import { useState } from "react"

type ImagePickerProps = {
  id?: string
  label?: string
  value: string
  onChange: (v: string) => void
  suggestions?: string[]
}

export default function ImagePicker({ id, label, value, onChange, suggestions = [] }: ImagePickerProps) {
  const [mode, setMode] = useState<"url" | "upload" | "gallery">("url")
  const [preview, setPreview] = useState<string>(value || "")

  const handleFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = String(e.target?.result || "")
      setPreview(result)
      onChange(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      {label && <label className="text-sm mb-1 block">{label}</label>}
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => setMode("url")} className={`px-2 py-1 rounded border ${mode === "url" ? "bg-muted" : ""}`}>URL</button>
        <button type="button" onClick={() => setMode("upload")} className={`px-2 py-1 rounded border ${mode === "upload" ? "bg-muted" : ""}`}>Upload</button>
        <button type="button" onClick={() => setMode("gallery")} className={`px-2 py-1 rounded border ${mode === "gallery" ? "bg-muted" : ""}`}>Gallery</button>
      </div>

      {mode === "url" && (
        <input
          id={id}
          className="input w-full"
          placeholder="Image URL"
          value={value}
          onChange={(e) => {
            setPreview(e.target.value)
            onChange(e.target.value)
          }}
        />
      )}

      {mode === "upload" && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {mode === "gallery" && (
        <div className="grid grid-cols-4 gap-2">
          {suggestions.length === 0 && <div className="text-sm text-muted-foreground">No suggestions</div>}
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="h-20 w-full rounded overflow-hidden border"
              onClick={() => {
                setPreview(s)
                onChange(s)
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt={`suggestion-${i}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div className="mt-2 h-48 w-full rounded overflow-hidden border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  )
}
