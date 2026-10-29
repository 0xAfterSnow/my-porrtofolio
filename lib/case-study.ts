// Case study data model, shared by the admin form, the server actions, and the public page.
// Database columns stay snake_case; `image` and `tech` are the original names for the
// cover image URL and the technologies list.

export type KeyFact = { label: string; value: string }
export type Metric = { value: string; label: string }
export type ArchitectureImage = { image_url: string; caption: string; alt: string }
export type CaseStudyLink = { label: string; url: string }

export type CaseStudyCategory = "backend" | "web3" | "both"

export type CaseStudy = {
  id?: string
  title: string
  slug: string
  client: string
  description: string
  image: string
  tech: string[]
  category: CaseStudyCategory
  published: boolean
  subtitle: string
  context: string
  role: string
  timeframe: string
  key_facts: KeyFact[]
  metrics: Metric[]
  brief: string
  approach: string
  architecture: ArchitectureImage[]
  architecture_notes: string
  implementation: string
  results: string
  honest_review: string
  takeaways: string
  links: CaseStudyLink[]
  created_at?: string
  updated_at?: string
}

// Rich text fields, in page order. Reading time is computed from these.
export const RICH_TEXT_FIELDS = [
  "brief",
  "approach",
  "architecture_notes",
  "implementation",
  "results",
  "honest_review",
  "takeaways",
] as const satisfies readonly (keyof CaseStudy)[]

export type RichTextField = (typeof RICH_TEXT_FIELDS)[number]

// Public page sections after the hero, in order. Used for headings and the table of contents.
export const SECTIONS = [
  { id: "brief", title: "The brief" },
  { id: "approach", title: "Approach" },
  { id: "architecture", title: "Architecture" },
  { id: "implementation", title: "Implementation" },
  { id: "results", title: "Results" },
  { id: "honest-review", title: "What I'd change" },
  { id: "takeaways", title: "Takeaways" },
  { id: "links", title: "Links" },
] as const

export type SectionId = (typeof SECTIONS)[number]["id"]

export const emptyCaseStudy = (): CaseStudy => ({
  title: "",
  slug: "",
  client: "",
  description: "",
  image: "",
  tech: [],
  category: "backend",
  published: false,
  subtitle: "",
  context: "",
  role: "",
  timeframe: "",
  key_facts: [],
  metrics: [],
  brief: "",
  approach: "",
  architecture: [],
  architecture_notes: "",
  implementation: "",
  results: "",
  honest_review: "",
  takeaways: "",
  links: [],
})

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v))

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const looksLikeHtml = (text: string) => /^\s*<(p|h[1-6]|ul|ol|blockquote|pre|table|figure|div)[\s>]/i.test(text)

// Legacy fields were plain text. Blank lines become paragraphs, single newlines become breaks.
export function plainTextToHtml(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return ""
  if (looksLikeHtml(trimmed)) return trimmed
  return trimmed
    .split(/\n{2,}/)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("")
}

function arrayOf<T>(value: unknown, map: (item: any) => T | null): T[] {
  if (!Array.isArray(value)) return []
  return value.map(map).filter((item): item is T => item !== null)
}

// Old rows stored metrics as {"label": "value"}; new rows store [{value, label}].
function normalizeMetrics(value: unknown): Metric[] {
  if (Array.isArray(value)) {
    return arrayOf(value, (m) => (m && (m.value || m.label) ? { value: str(m.value), label: str(m.label) } : null))
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(([label, v]) => ({ value: str(v), label }))
  }
  return []
}

// Accepts any row shape (pre or post migration) and returns the current model.
export function normalizeCaseStudy(row: Record<string, any>): CaseStudy {
  const category = ["backend", "web3", "both"].includes(row.category) ? row.category : "backend"
  return {
    id: row.id,
    title: str(row.title),
    slug: str(row.slug),
    client: str(row.client),
    description: str(row.description),
    image: str(row.image),
    tech: Array.isArray(row.tech) ? row.tech.map(str).filter(Boolean) : [],
    category,
    published: Boolean(row.published),
    subtitle: str(row.subtitle),
    context: str(row.context),
    role: str(row.role),
    timeframe: str(row.timeframe),
    key_facts: arrayOf(row.key_facts, (f) => (f && (f.label || f.value) ? { label: str(f.label), value: str(f.value) } : null)),
    metrics: normalizeMetrics(row.metrics),
    brief: str(row.brief) || plainTextToHtml(str(row.challenge)),
    approach: str(row.approach) || plainTextToHtml(str(row.solution)),
    architecture: arrayOf(row.architecture, (a) =>
      a && a.image_url ? { image_url: str(a.image_url), caption: str(a.caption), alt: str(a.alt) } : null,
    ),
    architecture_notes: str(row.architecture_notes),
    implementation: str(row.implementation),
    results: plainTextToHtml(str(row.results)),
    honest_review: str(row.honest_review),
    takeaways: str(row.takeaways),
    links: arrayOf(row.links, (l) => (l && l.url ? { label: str(l.label) || "Link", url: str(l.url) } : null)),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export function htmlToText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// True when rich text has no visible content (the editor saves "<p></p>" for an empty doc).
export function isEmptyHtml(html: string) {
  return !htmlToText(html) && !/<(img|table|pre)\b/i.test(html)
}

export function readingTimeFor(study: Pick<CaseStudy, RichTextField | "description">) {
  const text = [study.description, ...RICH_TEXT_FIELDS.map((f) => htmlToText(study[f]))].join(" ")
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Absolute http(s) URLs, or site-relative paths like /images/cover.png.
export function isValidUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export type ValidationErrors = Partial<Record<string, string>>

// Field-level checks shared by the form (instant feedback) and the server action (authority).
export function validateCaseStudy(study: CaseStudy): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!study.title.trim()) errors.title = "Add a title."
  if (!study.slug.trim()) errors.slug = "Add a slug."
  else if (!SLUG_PATTERN.test(study.slug)) errors.slug = "Use lowercase letters, numbers, and single hyphens."
  if (!study.description.trim()) errors.description = "Add a short description. It is also the meta description."
  if (study.image && !isValidUrl(study.image)) errors.image = "Enter a full URL starting with https://, or a path starting with /."

  study.links.forEach((link, i) => {
    if (!link.url.trim()) errors[`links.${i}.url`] = "Add a URL or remove this link."
    else if (!isValidUrl(link.url)) errors[`links.${i}.url`] = "Enter a full URL starting with https://."
    if (!link.label.trim()) errors[`links.${i}.label`] = "Add a label, like Code or Diagrams."
  })
  study.architecture.forEach((img, i) => {
    if (!img.image_url.trim()) errors[`architecture.${i}.image_url`] = "Upload an image or paste its URL."
    else if (!isValidUrl(img.image_url)) errors[`architecture.${i}.image_url`] = "Enter a full URL starting with https://."
    if (!img.alt.trim()) errors[`architecture.${i}.alt`] = "Describe the diagram for screen readers."
  })
  return errors
}
