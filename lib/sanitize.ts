import "server-only"
import sanitizeHtml, { type IOptions } from "sanitize-html"

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

// Run on render. Each section already has an h2, so content headings shift down one
// level to keep the outline semantic. Tables get a scroll wrapper and code blocks get
// a wrapper that carries the language for the label and copy button.
export function renderRichText(html: string) {
  const clean = sanitizeHtml(html ?? "", {
    ...baseOptions,
    transformTags: {
      h1: "h3",
      h2: "h3",
      h3: "h4",
      h4: "h4",
      b: "strong",
      i: "em",
      a: (tagName, attribs) => ({
        tagName,
        attribs: isExternal(attribs.href)
          ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
          : attribs,
      }),
    },
  })

  // Safe to post-process with patterns: sanitize-html escapes every "<" in text, so
  // these only ever match real tags.
  return clean
    .replace(/<table\b/g, '<div class="table-scroll"><table')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/g, (_, attrs: string, inner: string) => {
      const lang = /class="[^"]*language-([\w+#-]+)/.exec(inner)?.[1] ?? ""
      return `<div class="code-block" data-language="${lang}"><pre${attrs}>${inner}</pre></div>`
    })
}
