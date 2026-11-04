import "server-only"
import sanitizeHtml, { type IOptions } from "sanitize-html"
import { annotateCodeLanguages } from "@/lib/code-language"
import { slugify } from "@/lib/case-study"

// Everything the rich text editor can produce, and nothing else.
const baseOptions: IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "p", "br", "hr",
    "strong", "em", "s", "u", "code", "pre", "blockquote",
    "ul", "ol", "li", "a",
    "img", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    code: ["class"],
    pre: ["class"],
    span: ["class"],
    ol: ["start"],
    th: ["colspan", "rowspan", "colwidth"],
    td: ["colspan", "rowspan", "colwidth"],
    col: ["span", "style"],
  },
  allowedClasses: {
    code: ["language-*"],
    pre: ["language-*"],
    span: ["hljs-*"],
  },
  allowedStyles: {
    col: { width: [/^\d+(\.\d+)?(px|%)$/], "min-width": [/^\d+(\.\d+)?(px|%)$/] },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
}

const isExternal = (href = "") => /^https?:\/\//i.test(href)

// Run on save: the stored HTML is clean whatever the browser sent.
export function sanitizeRichText(html: string) {
  return sanitizeHtml(html ?? "", {
    ...baseOptions,
    transformTags: {
      h1: "h2",
      h5: "h3",
      h6: "h3",
      h4: "h3",
      b: "strong",
      i: "em",
    },
  }).trim()
}

const isExternalLink = (tagName: string, attribs: sanitizeHtml.Attributes) => ({
  tagName,
  attribs: isExternal(attribs.href) ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs,
})

// Shared display transforms. Safe to post-process with patterns: sanitize-html escapes
// every "<" in text, so these only ever match real tags.
function decorate(clean: string) {
  return annotateCodeLanguages(clean)
    .replace(/<table\b/g, '<div class="table-scroll"><table')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/g, (_, attrs: string, inner: string) => {
      const lang = /class="[^"]*language-([\w+#-]+)/.exec(inner)?.[1] ?? ""
      return `<div class="code-block" data-language="${lang}"><pre${attrs}>${inner}</pre></div>`
    })
}

// Run on render. Each case study section already has an h2, so content headings shift
// down one level to keep the outline semantic.
export function renderRichText(html: string) {
  return decorate(
    sanitizeHtml(html ?? "", {
      ...baseOptions,
      transformTags: { h1: "h3", h2: "h3", h3: "h4", h4: "h4", b: "strong", i: "em", a: isExternalLink },
    }),
  )
}

export type ArticleHeading = { id: string; title: string; level: 2 | 3 }

const decodeText = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim()

// Run on render for blog posts: the page title is the only h1, so content keeps its h2/h3.
// Headings get stable ids, returned for the table of contents.
export function renderArticle(html: string): { html: string; headings: ArticleHeading[] } {
  const clean = sanitizeHtml(html ?? "", {
    ...baseOptions,
    transformTags: { h1: "h2", h4: "h3", h5: "h3", h6: "h3", b: "strong", i: "em", a: isExternalLink },
  })

  const headings: ArticleHeading[] = []
  const used = new Map<string, number>()
  const withIds = clean.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (match, tag: string, inner: string) => {
    const title = decodeText(inner)
    if (!title) return match
    const base = slugify(title) || "section"
    const n = used.get(base) ?? 0
    used.set(base, n + 1)
    const id = n ? `${base}-${n + 1}` : base
    headings.push({ id, title, level: tag === "h2" ? 2 : 3 })
    return `<${tag} id="${id}">${inner}</${tag}>`
  })

  return { html: decorate(withIds), headings }
}
