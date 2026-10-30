"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { renderRichText, sanitizeRichText } from "@/lib/sanitize"
import {
  RICH_TEXT_FIELDS,
  isEmptyHtml,
  validateCaseStudy,
  type CaseStudy,
  type RichTextField,
  type ValidationErrors,
} from "@/lib/case-study"

export type SaveCaseStudyResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string; fieldErrors?: ValidationErrors }

const trim = (v: string) => (v ?? "").trim()

// Trims text, drops blank repeatable rows, de-duplicates tags, and sanitizes rich text.
function clean(input: CaseStudy): CaseStudy {
  const rich = Object.fromEntries(
    RICH_TEXT_FIELDS.map((field) => {
      const html = sanitizeRichText(input[field] ?? "")
      return [field, isEmptyHtml(html) ? "" : html]
    }),
  ) as Record<RichTextField, string>

  return {
    ...input,
    ...rich,
    title: trim(input.title),
    slug: trim(input.slug).toLowerCase(),
    client: trim(input.client),
    description: trim(input.description),
    image: trim(input.image),
    subtitle: trim(input.subtitle),
    context: trim(input.context),
    role: trim(input.role),
    timeframe: trim(input.timeframe),
    tech: [...new Set(input.tech.map(trim).filter(Boolean))],
    key_facts: input.key_facts
      .map((f) => ({ label: trim(f.label), value: trim(f.value) }))
      .filter((f) => f.label || f.value),
    metrics: input.metrics
      .map((m) => ({ value: trim(m.value), label: trim(m.label) }))
      .filter((m) => m.value || m.label),
    architecture: input.architecture
      .map((a) => ({ image_url: trim(a.image_url), caption: trim(a.caption), alt: trim(a.alt) }))
      .filter((a) => a.image_url || a.caption || a.alt),
    links: input.links
      .map((l) => ({ label: trim(l.label), url: trim(l.url) }))
      .filter((l) => l.label || l.url),
  }
}

async function requireUser() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function saveCaseStudy(input: CaseStudy, previousSlug?: string): Promise<SaveCaseStudyResult> {
  const { supabase, user } = await requireUser()
  if (!user) return { ok: false, error: "Your session has expired. Sign in again, then save." }

  const study = clean(input)
  const fieldErrors = validateCaseStudy(study)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Some fields need attention before saving.", fieldErrors }
  }

  let duplicate = supabase.from("case_studies").select("id").eq("slug", study.slug).limit(1)
  if (study.id) duplicate = duplicate.neq("id", study.id)
  const { data: taken } = await duplicate
  if (taken && taken.length > 0) {
    return {
      ok: false,
      error: "That slug is taken.",
      fieldErrors: { slug: "Another case study already uses this slug." },
    }
  }

  const { id, created_at, updated_at, ...payload } = study
  const query = id
    ? supabase.from("case_studies").update(payload).eq("id", id)
    : supabase.from("case_studies").insert([payload])
  const { data, error } = await query.select("id, slug").single()

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "That slug is taken.", fieldErrors: { slug: "Another case study already uses this slug." } }
    }
    if (error.code === "PGRST204" || /column .* does not exist|Could not find the .* column/i.test(error.message)) {
      return {
        ok: false,
        error:
          "The database is missing the new case study columns. Run supabase/migrations/20261029000000_case_study_writeup.sql in the Supabase SQL editor, then save again.",
      }
    }
    return { ok: false, error: `Saving failed: ${error.message}` }
  }

  revalidatePath("/")
  revalidatePath(`/case-studies/${data.slug}`)
  if (previousSlug && previousSlug !== data.slug) revalidatePath(`/case-studies/${previousSlug}`)

  return { ok: true, id: data.id, slug: data.slug }
}

// Renders unsaved rich text exactly as the public page would, for the admin preview.
export async function renderCaseStudyPreview(
  input: Pick<CaseStudy, RichTextField>,
): Promise<{ ok: true; html: Record<RichTextField, string> } | { ok: false; error: string }> {
  const { user } = await requireUser()
  if (!user) return { ok: false, error: "Your session has expired. Sign in again to preview." }

  const html = Object.fromEntries(
    RICH_TEXT_FIELDS.map((field) => {
      const clean = sanitizeRichText(input[field] ?? "")
      return [field, isEmptyHtml(clean) ? "" : renderRichText(clean)]
    }),
  ) as Record<RichTextField, string>

  return { ok: true, html }
}
