import "server-only"
import { common, createLowlight } from "lowlight"

const lowlight = createLowlight(common)

// Languages we can both detect and colour with Prism, mapped to Prism's names.
const PRISM_NAME: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  bash: "bash",
  json: "json",
  sql: "sql",
  rust: "rust",
  go: "go",
  yaml: "yaml",
  dockerfile: "docker",
}
const SUBSET = Object.keys(PRISM_NAME)

// Below this, the guess is too weak to be worth colouring.
const MIN_RELEVANCE = 3

const decode = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")

// Code blocks written before the editor had a language picker have no language, so Prism
// leaves them grey. Detect one on the server and add the class Prism looks for.
export function annotateCodeLanguages(html: string) {
  return html.replace(
    /<pre\b([^>]*)>\s*<code(?![^>]*\blanguage-)([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/g,
    (match, preAttrs: string, codeAttrs: string, inner: string) => {
      const result = lowlight.highlightAuto(decode(inner), { subset: SUBSET })
      const detected = result.data?.language
      if (!detected || (result.data?.relevance ?? 0) < MIN_RELEVANCE) return match
      const lang = PRISM_NAME[detected]
      const attrs = /\bclass="/.test(codeAttrs)
        ? codeAttrs.replace(/\bclass="/, `class="language-${lang} `)
        : `${codeAttrs} class="language-${lang}"`
      return `<pre${preAttrs}><code${attrs}>${inner}</code></pre>`
    },
  )
}
