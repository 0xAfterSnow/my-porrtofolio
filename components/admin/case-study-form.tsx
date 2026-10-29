"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Eye, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RichTextEditor } from "./rich-text-editor"
import { FieldError, FieldHint, FormSection, ImageField, RepeatableList, TagInput } from "./case-study-fields"
import { CaseStudyPreview } from "./case-study-preview"
import { saveCaseStudy } from "@/app/actions/case-studies"
import {
  emptyCaseStudy,
  isEmptyHtml,
  normalizeCaseStudy,
  readingTimeFor,
  slugify,
  validateCaseStudy,
  type CaseStudy,
  type RichTextField,
  type ValidationErrors,
} from "@/lib/case-study"

type SectionKey =
  | "basics"
  | "facts"
  | "brief"
  | "approach"
  | "architecture"
  | "implementation"
  | "results"
  | "review"
  | "takeaways"
  | "links"
  | "publishing"

// Which section holds each validated field, so errors can open the right group.
const errorSection = (key: string): SectionKey => {
  if (key.startsWith("links.")) return "links"
  if (key.startsWith("architecture.")) return "architecture"
  return "basics"
}

type Draft = { data: CaseStudy; savedAt: number }

const draftKey = (id?: string) => `case-study-draft:${id ?? "new"}`

function readDraft(id?: string): Draft | null {
  try {
    const raw = localStorage.getItem(draftKey(id))
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch {
    return null
  }
}

const timeLabel = (ms: number) => new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

export function CaseStudyForm({ study }: { study?: Record<string, any> }) {
  const router = useRouter()
  const initial = useMemo(() => (study ? normalizeCaseStudy(study) : emptyCaseStudy()), [study])
  const [form, setForm] = useState<CaseStudy>(initial)
  // Bumped to remount rich text editors when the whole form is replaced (draft restore).
  const [editorKey, setEditorKey] = useState(0)
  const [slugTouched, setSlugTouched] = useState(Boolean(study?.id))
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [open, setOpen] = useState<Set<SectionKey>>(new Set(["basics"]))
  const [pendingDraft, setPendingDraft] = useState<Draft | null>(null)
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null)
  const [slugTaken, setSlugTaken] = useState(false)
  const dirty = useRef(false)

  const update = useCallback((patch: Partial<CaseStudy>) => {
    dirty.current = true
    setForm((f) => ({ ...f, ...patch }))
    // Editing a field clears its stale error, including errors on its rows (links.0.url).
    const changed = Object.keys(patch)
    setErrors((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([key]) => !changed.some((c) => key === c || key.startsWith(`${c}.`))),
      )
      return Object.keys(next).length === Object.keys(prev).length ? prev : next
    })
  }, [])

  const setRich = useCallback((field: RichTextField) => (html: string) => update({ [field]: html } as Partial<CaseStudy>), [update])

  // Offer to restore a local draft that is newer than the saved record.
  useEffect(() => {
    const draft = readDraft(study?.id)
    if (!draft) return
    const savedAt = study?.updated_at ? Date.parse(study.updated_at) : 0
    if (draft.savedAt > savedAt && JSON.stringify(draft.data) !== JSON.stringify(initial)) setPendingDraft(draft)
  }, [study?.id, study?.updated_at, initial])

  // Autosave to this browser one second after the last change.
  useEffect(() => {
    if (!dirty.current) return
    const timer = setTimeout(() => {
      const savedAt = Date.now()
      try {
        localStorage.setItem(draftKey(study?.id), JSON.stringify({ data: form, savedAt }))
        setDraftSavedAt(savedAt)
      } catch {
        // Storage full or blocked: autosave is a convenience, saving still works.
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [form, study?.id])

  // Live slug uniqueness check, debounced.
  useEffect(() => {
    if (!form.slug) return setSlugTaken(false)
    const timer = setTimeout(async () => {
      const supabase = createClient()
      let q = supabase.from("case_studies").select("id").eq("slug", form.slug).limit(1)
      if (study?.id) q = q.neq("id", study.id)
      const { data } = await q
      setSlugTaken(Boolean(data && data.length))
    }, 400)
    return () => clearTimeout(timer)
  }, [form.slug, study?.id])

  const toggle = (key: SectionKey) => (isOpen: boolean) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (isOpen) next.add(key)
      else next.delete(key)
      return next
    })

  const restoreDraft = () => {
    if (!pendingDraft) return
    setForm(normalizeCaseStudy(pendingDraft.data))
    setSlugTouched(true)
    setEditorKey((k) => k + 1)
    setPendingDraft(null)
    setOpen(new Set(["basics", "facts", "brief", "approach", "architecture", "implementation", "results", "review", "takeaways", "links"]))
  }

  const discardDraft = () => {
    try {
      localStorage.removeItem(draftKey(study?.id))
    } catch {}
    setPendingDraft(null)
  }

  const showErrors = (errs: ValidationErrors) => {
    setErrors(errs)
    const keys = Object.keys(errs)
    if (!keys.length) return
    setOpen((prev) => new Set([...prev, ...keys.map(errorSection)]))
    requestAnimationFrame(() => {
      const first = keys[0]
      const el = document.getElementById(`field-${first.replace(/\./g, "-")}`)
      el?.focus()
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const clientErrors = validateCaseStudy(form)
    if (slugTaken) clientErrors.slug = "Another case study already uses this slug."
    if (Object.keys(clientErrors).length) {
      setFormError("Some fields need attention before saving.")
      return showErrors(clientErrors)
    }

    setSaving(true)
    const result = await saveCaseStudy(form, study?.slug)
    setSaving(false)

    if (!result.ok) {
      setFormError(result.error)
      if (result.fieldErrors) showErrors(result.fieldErrors)
      return
    }
    try {
      localStorage.removeItem(draftKey(study?.id))
    } catch {}
    dirty.current = false
    router.push("/admin/case-studies")
    router.refresh()
  }

  const err = (key: string) => errors[key]
  const errId = (key: string) => `field-${key.replace(/\./g, "-")}-error`
  const filled = (...fields: RichTextField[]) => fields.some((f) => !isEmptyHtml(form[f]))
  const sectionHasError = (key: SectionKey) => Object.keys(errors).some((k) => errorSection(k) === key)

  const field = (key: string, label: string, control: ReactNode, hint?: string, error?: string) => (
    <div className="space-y-2">
      <Label htmlFor={`field-${key}`}>{label}</Label>
      {control}
      {hint && <FieldHint>{hint}</FieldHint>}
      <FieldError id={errId(key)} message={error ?? err(key)} />
    </div>
  )

  const textInput = (key: keyof CaseStudy, label: string, placeholder?: string, hint?: string) =>
    field(
      key,
      label,
      <Input
        id={`field-${key}`}
        value={form[key] as string}
        onChange={(e) => update({ [key]: e.target.value } as Partial<CaseStudy>)}
        placeholder={placeholder}
        aria-invalid={Boolean(err(key))}
        aria-describedby={err(key) ? errId(key) : undefined}
      />,
      hint,
    )

  const editor = (fieldName: RichTextField, placeholder: string) => (
    <RichTextEditor
      key={`${fieldName}-${editorKey}`}
      id={`field-${fieldName}`}
      content={form[fieldName]}
      onChange={setRich(fieldName)}
      placeholder={placeholder}
      uploadFolder="case-studies"
      compact
    />
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 pb-24">
      {pendingDraft && (
        <Alert>
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>You have unsaved changes from {timeLabel(pendingDraft.savedAt)} in this browser.</span>
            <span className="flex gap-2">
              <Button type="button" size="sm" onClick={restoreDraft}>
                Restore draft
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={discardDraft}>
                Discard
              </Button>
            </span>
          </AlertDescription>
        </Alert>
      )}

      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <FormSection
        title="Basics"
        description="Title, hook, and the facts shown in the hero."
        open={open.has("basics")}
        onOpenChange={toggle("basics")}
        filled={Boolean(form.title)}
        hasError={sectionHasError("basics")}
      >
        {field(
          "title",
          "Title (required)",
          <Input
            id="field-title"
            value={form.title}
            onChange={(e) => update({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })}
            aria-invalid={Boolean(err("title"))}
            aria-describedby={err("title") ? errId("title") : undefined}
          />,
        )}
        {field(
          "slug",
          "Slug (required)",
          <div className="flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
            <span className="pl-3 text-sm text-muted-foreground">/case-studies/</span>
            <input
              id="field-slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                update({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
              }}
              className="h-9 min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none"
              aria-invalid={Boolean(err("slug") || slugTaken)}
              aria-describedby={err("slug") || slugTaken ? errId("slug") : undefined}
            />
          </div>,
          slugTouched ? undefined : "Generated from the title until you edit it.",
          err("slug") ?? (slugTaken ? "Another case study already uses this slug." : undefined),
        )}
        {textInput("subtitle", "Subtitle", "Voice AI that holds 1,000 concurrent calls", "One line under the title.")}
        {field(
          "description",
          "Description (required)",
          <Textarea
            id="field-description"
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={3}
            aria-invalid={Boolean(err("description"))}
            aria-describedby={err("description") ? errId("description") : undefined}
          />,
          `Used for search and social previews. ${form.description.length}/160 characters.`,
        )}
        <div className="grid gap-5 md:grid-cols-2">
          {textInput("context", "Context", "Engineering assessment")}
          {textInput("timeframe", "Timeframe", "Oct 2025")}
        </div>
        {textInput("role", "Role", "Sole author: design, diagrams, implementation")}
        {textInput("client", "Client", "Optional")}
        <ImageField
          id="field-image"
          label="Cover image"
          value={form.image}
          onChange={(image) => update({ image })}
          error={err("image")}
          hint="Also used as the Open Graph image when shared."
        />
        {field(
          "tech",
          "Technologies",
          <TagInput id="field-tech" value={form.tech} onChange={(tech) => update({ tech })} placeholder="Type and press Enter" />,
          "Press Enter or comma to add. Backspace removes the last one.",
        )}
      </FormSection>

      <FormSection
        title="Key facts & metrics"
        description="Big numbers first, then a short facts table."
        open={open.has("facts")}
        onOpenChange={toggle("facts")}
        filled={form.metrics.length > 0 || form.key_facts.length > 0}
      >
        <div className="space-y-2">
          <p className="text-sm font-medium">Metrics</p>
          <RepeatableList
            items={form.metrics}
            onChange={(metrics) => update({ metrics })}
            newItem={() => ({ value: "", label: "" })}
            addLabel="Add metric"
            emptyLabel="No metrics yet. The stat tiles are hidden until you add one."
            itemLabel={(i) => `Metric ${i + 1}`}
            renderItem={(m, i, set) => (
              <div className="grid gap-3 sm:grid-cols-3">
                <Input aria-label={`Metric ${i + 1} value`} value={m.value} onChange={(e) => set({ value: e.target.value })} placeholder="1,000" />
                <Input aria-label={`Metric ${i + 1} label`} className="sm:col-span-2" value={m.label} onChange={(e) => set({ label: e.target.value })} placeholder="concurrent calls" />
              </div>
            )}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Key facts</p>
          <RepeatableList
            items={form.key_facts}
            onChange={(key_facts) => update({ key_facts })}
            newItem={() => ({ label: "", value: "" })}
            addLabel="Add fact"
            emptyLabel="No facts yet. Try Stack, Team size, or Duration."
            itemLabel={(i) => `Fact ${i + 1}`}
            renderItem={(f, i, set) => (
              <div className="grid gap-3 sm:grid-cols-3">
                <Input aria-label={`Fact ${i + 1} label`} value={f.label} onChange={(e) => set({ label: e.target.value })} placeholder="Team size" />
                <Input aria-label={`Fact ${i + 1} value`} className="sm:col-span-2" value={f.value} onChange={(e) => set({ value: e.target.value })} placeholder="Solo" />
              </div>
            )}
          />
        </div>
      </FormSection>

      <FormSection title="The brief" description="The problem as it was given. Quote it if you can." open={open.has("brief")} onOpenChange={toggle("brief")} filled={filled("brief")}>
        {editor("brief", "Paste or quote the brief…")}
      </FormSection>

      <FormSection title="Approach" description="How you broke it down. Tables work well for trade-offs." open={open.has("approach")} onOpenChange={toggle("approach")} filled={filled("approach")}>
        {editor("approach", "Describe your approach…")}
      </FormSection>

      <FormSection
        title="Architecture"
        description="Diagrams with captions, then notes."
        open={open.has("architecture")}
        onOpenChange={toggle("architecture")}
        filled={form.architecture.length > 0 || filled("architecture_notes")}
        hasError={sectionHasError("architecture")}
      >
        <RepeatableList
          items={form.architecture}
          onChange={(architecture) => update({ architecture })}
          newItem={() => ({ image_url: "", caption: "", alt: "" })}
          addLabel="Add diagram"
          emptyLabel="No diagrams yet."
          itemLabel={(i) => `Diagram ${i + 1}`}
          renderItem={(a, i, set) => (
            <div className="space-y-3">
              <ImageField
                id={`field-architecture-${i}-image_url`}
                label="Image"
                value={a.image_url}
                onChange={(image_url) => set({ image_url })}
                error={err(`architecture.${i}.image_url`)}
              />
              <div className="space-y-2">
                <Label htmlFor={`field-architecture-${i}-alt`}>Alt text (required)</Label>
                <Input id={`field-architecture-${i}-alt`} value={a.alt} onChange={(e) => set({ alt: e.target.value })} placeholder="What the diagram shows" aria-invalid={Boolean(err(`architecture.${i}.alt`))} />
                <FieldError message={err(`architecture.${i}.alt`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`field-architecture-${i}-caption`}>Caption</Label>
                <Input id={`field-architecture-${i}-caption`} value={a.caption} onChange={(e) => set({ caption: e.target.value })} placeholder="Figure 1. Call flow from ingress to worker" />
              </div>
            </div>
          )}
        />
        <div className="space-y-2">
          <Label htmlFor="field-architecture_notes">Notes below the diagrams</Label>
          {editor("architecture_notes", "Explain the moving parts…")}
        </div>
      </FormSection>

      <FormSection title="Implementation" description="The interesting parts. Code blocks get syntax highlighting and a copy button." open={open.has("implementation")} onOpenChange={toggle("implementation")} filled={filled("implementation")}>
        {editor("implementation", "Walk through the implementation…")}
      </FormSection>

      <FormSection title="Results" description="What happened. Older case studies keep their results here." open={open.has("results")} onOpenChange={toggle("results")} filled={filled("results")}>
        {editor("results", "Outcomes, numbers, and what shipped…")}
      </FormSection>

      <FormSection title="What I'd change" description="An honest review. Shown as a callout." open={open.has("review")} onOpenChange={toggle("review")} filled={filled("honest_review")}>
        {editor("honest_review", "With hindsight, I would…")}
      </FormSection>

      <FormSection title="Takeaways" description="A few bullets the reader should remember." open={open.has("takeaways")} onOpenChange={toggle("takeaways")} filled={filled("takeaways")}>
        {editor("takeaways", "• …")}
      </FormSection>

      <FormSection
        title="Links"
        description="Shown as buttons at the end, like Code, Diagrams, or Blog post."
        open={open.has("links")}
        onOpenChange={toggle("links")}
        filled={form.links.length > 0}
        hasError={sectionHasError("links")}
      >
        <RepeatableList
          items={form.links}
          onChange={(links) => update({ links })}
          newItem={() => ({ label: "", url: "" })}
          addLabel="Add link"
          emptyLabel="No links yet."
          itemLabel={(i) => `Link ${i + 1}`}
          renderItem={(l, i, set) => (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Input id={`field-links-${i}-label`} aria-label={`Link ${i + 1} label`} value={l.label} onChange={(e) => set({ label: e.target.value })} placeholder="Code" aria-invalid={Boolean(err(`links.${i}.label`))} />
                <FieldError message={err(`links.${i}.label`)} />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Input id={`field-links-${i}-url`} aria-label={`Link ${i + 1} URL`} value={l.url} onChange={(e) => set({ url: e.target.value })} placeholder="https://github.com/…" aria-invalid={Boolean(err(`links.${i}.url`))} />
                <FieldError message={err(`links.${i}.url`)} />
              </div>
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Publishing" open={open.has("publishing")} onOpenChange={toggle("publishing")} filled={form.published}>
        <div className="space-y-2">
          <Label htmlFor="field-category">Category</Label>
          <Select value={form.category} onValueChange={(value) => update({ category: value as CaseStudy["category"] })}>
            <SelectTrigger id="field-category" className="w-full sm:w-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="web3">Web3</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
          <FieldHint>Decides which homepage mode lists it.</FieldHint>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="published" checked={form.published} onCheckedChange={(checked) => update({ published: checked === true })} />
          <Label htmlFor="published" className="cursor-pointer">
            Publish immediately
          </Label>
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-10 -mx-6 flex flex-wrap items-center gap-3 border-t bg-background/95 px-6 py-3 backdrop-blur">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : study?.id ? (
            "Update case study"
          ) : (
            "Create case study"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)} disabled={saving}>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
        <span className="ml-auto text-sm text-muted-foreground" aria-live="polite">
          {readingTimeFor(form)} min read
          {draftSavedAt ? ` · Draft saved in this browser at ${timeLabel(draftSavedAt)}` : ""}
        </span>
      </div>

      <CaseStudyPreview open={previewOpen} onOpenChange={setPreviewOpen} study={form} />
    </form>
  )
}
