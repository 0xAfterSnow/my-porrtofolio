"use client"

import { memo, useEffect, useRef } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-python"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-solidity"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-go"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-docker"
import { cn } from "@/lib/utils"

interface RichTextProps {
  // Already sanitized and transformed by renderRichText on the server.
  html: string
  className?: string
  onImageClick?: (image: { src: string; alt: string }) => void
}

const COPY_LABEL = "Copy"

// Memoised: a re-render would let React rewrite the HTML and drop Prism's highlighting
// and the injected buttons, so it only re-renders when its props change.
export const RichText = memo(function RichText({ html, className, onImageClick }: RichTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    Prism.highlightAllUnder(root)

    // A copy button per code block. Added once; the markup comes from the server.
    const cleanups: (() => void)[] = []
    root.querySelectorAll<HTMLElement>(".code-block").forEach((block) => {
      if (block.querySelector(".copy-code")) return
      const button = document.createElement("button")
      button.type = "button"
      button.className = "copy-code"
      button.textContent = COPY_LABEL
      button.setAttribute("aria-label", "Copy code to clipboard")
      let timer: ReturnType<typeof setTimeout>
      const onClick = async () => {
        const code = block.querySelector("pre")?.innerText ?? ""
        try {
          await navigator.clipboard.writeText(code)
          button.textContent = "Copied"
        } catch {
          button.textContent = "Copy failed"
        }
        clearTimeout(timer)
        timer = setTimeout(() => (button.textContent = COPY_LABEL), 1800)
      }
      button.addEventListener("click", onClick)
      block.appendChild(button)
      cleanups.push(() => {
        clearTimeout(timer)
        button.removeEventListener("click", onClick)
        button.remove()
      })
    })

    if (onImageClick) {
      root.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        img.classList.add("zoomable")
        img.tabIndex = 0
        img.setAttribute("role", "button")
        img.setAttribute("aria-label", `Enlarge image: ${img.alt || "image"}`)
        const open = () => onImageClick({ src: img.currentSrc || img.src, alt: img.alt })
        const onKey = (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            open()
          }
        }
        img.addEventListener("click", open)
        img.addEventListener("keydown", onKey)
        cleanups.push(() => {
          img.removeEventListener("click", open)
          img.removeEventListener("keydown", onKey)
        })
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [html, onImageClick])

  return (
    <div
      ref={ref}
      className={cn(
        "case-prose blog-prose prose prose-lg max-w-none dark:prose-invert",
        "prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h3:mt-12 prose-h3:text-2xl prose-h4:mt-8 prose-h4:text-xl",
        "prose-p:text-foreground/80 prose-li:text-foreground/80 prose-li:marker:text-muted-foreground",
        "prose-a:font-medium prose-a:text-foreground prose-a:underline prose-a:decoration-border prose-a:underline-offset-4 hover:prose-a:decoration-foreground",
        "prose-strong:font-semibold prose-strong:text-foreground prose-hr:border-border",
        className,
      )}
      // Prism highlights code blocks on page load, before hydration, so the markup differs on purpose.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
})
