"use client"

import { useId, useState, type KeyboardEvent, type ReactNode } from "react"
import { ArrowDown, ArrowUp, ChevronDown, Loader2, Plus, Trash2, Upload, X } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  )
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

interface FormSectionProps {
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  filled?: boolean
  hasError?: boolean
  children: ReactNode
}

// One collapsible group of the form, in public page order.
export function FormSection({ title, description, open, onOpenChange, filled, hasError, children }: FormSectionProps) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="rounded-xl border bg-card">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span>
          <span className="block font-semibold">{title}</span>
          {description && <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {hasError ? (
            <span className="text-xs font-medium text-destructive">Needs attention</span>
          ) : filled ? (
            <span className="text-xs font-medium text-muted-foreground">Has content</span>
          ) : null}
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-5 border-t px-5 py-5">{children}</CollapsibleContent>
    </Collapsible>
  )
}

interface TagInputProps {
  id: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

// Enter, comma, or Tab adds a tag; Backspace on an empty input removes the last one.
export function TagInput({ id, value, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState("")

  const add = (raw: string) => {
    const next = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => !value.some((v) => v.toLowerCase() === t.toLowerCase()))
    if (next.length) onChange([...value, ...next])
    setDraft("")
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === "," || e.key === "Tab") && draft.trim()) {
      e.preventDefault()
      add(draft)
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-md border bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => draft.trim() && add(draft)}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text")
          if (text.includes(",")) {
            e.preventDefault()
            add(text)
          }
        }}
        placeholder={value.length ? "" : placeholder}
        className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm outline-none"
      />
    </div>
  )
}

interface ImageFieldProps {
  id: string
  label: string
  value: string
  onChange: (url: string) => void
  error?: string
  hint?: string
}

// Upload to the blog-images bucket, or paste a URL. Shows a preview either way.
export function ImageField({ id, label, value, onChange, error, hint }: ImageFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [broken, setBroken] = useState(false)
  const errorId = `${id}-error`

  const upload = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error("Upload failed. The file is over 10 MB.")
      const supabase = createBrowserSupabaseClient()
      const ext = file.name.split(".").pop()
      const path = `case-studies/${crypto.randomUUID()}.${ext}`
      const { error: err } = await supabase.storage.from("blog-images").upload(path, file)
      if (err) throw err
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path)
      setBroken(false)
      onChange(data.publicUrl)
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed. Try again, or paste an image URL.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={id}
          value={value}
          onChange={(e) => {
            setBroken(false)
            onChange(e.target.value)
          }}
          placeholder="https://… or upload a file"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <Button type="button" variant="outline" className="relative shrink-0" disabled={uploading} asChild>
          <label>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) upload(file)
                e.target.value = ""
              }}
            />
          </label>
        </Button>
      </div>
      {hint && <FieldHint>{hint}</FieldHint>}
      <FieldError id={errorId} message={error || uploadError || undefined} />
      {value && !broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          onError={() => setBroken(true)}
          className="max-h-48 rounded-md border bg-white object-contain"
        />
      )}
      {value && broken && <p className="text-sm text-destructive">This image could not be loaded. Check the URL.</p>}
    </div>
  )
}

interface RepeatableListProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  newItem: () => T
  addLabel: string
  emptyLabel: string
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode
  itemLabel: (index: number) => string
}

// Rows with add, remove, and move up or down controls.
export function RepeatableList<T>({ items, onChange, newItem, addLabel, emptyLabel, renderItem, itemLabel }: RepeatableListProps<T>) {
  const listId = useId()
  const move = (from: number, to: number) => {
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">{emptyLabel}</p>}
      <ol className="space-y-3" id={listId}>
        {items.map((item, i) => (
          <li key={i} className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{itemLabel(i)}</span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label={`Move ${itemLabel(i)} up`}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={i === items.length - 1} onClick={() => move(i, i + 1)} aria-label={`Move ${itemLabel(i)} down`}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${itemLabel(i)}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {renderItem(item, i, (patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))))}
          </li>
        ))}
      </ol>
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, newItem()])}>
        <Plus className="mr-2 h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  )
}
