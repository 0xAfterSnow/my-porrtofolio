"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { CaseStudyArticle } from "@/components/case-study/case-study-article"
import { renderCaseStudyPreview } from "@/app/actions/case-studies"
import { readingTimeFor, type CaseStudy, type RichTextField } from "@/lib/case-study"

// Drops blank repeatable rows, the same way saving does.
function withoutBlankRows(study: CaseStudy): CaseStudy {
  return {
    ...study,
    key_facts: study.key_facts.filter((f) => f.label.trim() || f.value.trim()),
    metrics: study.metrics.filter((m) => m.value.trim() || m.label.trim()),
    architecture: study.architecture.filter((a) => a.image_url.trim()),
    links: study.links.filter((l) => l.url.trim()),
  }
}

interface CaseStudyPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  study: CaseStudy
}

export function CaseStudyPreview({ open, onOpenChange, study }: CaseStudyPreviewProps) {
  const [html, setHtml] = useState<Record<RichTextField, string> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setHtml(null)
    setError(null)
    renderCaseStudyPreview(study).then((result) => {
      if (cancelled) return
      if (result.ok) setHtml(result.html)
      else setError(result.error)
    })
    return () => {
      cancelled = true
    }
    // Rendered once per opening, from the data at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const clean = withoutBlankRows(study)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-dvh max-w-none overflow-y-auto rounded-none border-0 p-0 sm:max-w-none">
        <DialogTitle className="sr-only">Preview: {study.title || "Untitled case study"}</DialogTitle>
        <DialogDescription className="sr-only">How the case study will look once published.</DialogDescription>
        <div className="sticky top-0 z-20 flex items-center justify-center border-b bg-background/90 px-12 py-2 text-sm text-muted-foreground backdrop-blur">
          Preview of unsaved changes. Nothing is published until you save.
        </div>
        <div className="bg-background px-6 pt-12 pb-24 text-foreground">
          {error ? (
            <p role="alert" className="mx-auto max-w-xl text-center text-destructive">
              {error}
            </p>
          ) : html ? (
            <CaseStudyArticle study={clean} html={html} readingTime={readingTimeFor(clean)} />
          ) : (
            <p className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Rendering preview…
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
