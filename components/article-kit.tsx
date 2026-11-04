"use client"

// Reading features shared by case studies and blog posts.

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { focusRing } from "@/lib/styles"
import { Icon } from "@/components/icon"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export type TocItem = { id: string; title: string; level?: 2 | 3 }
export type ArticleNeighbour = { slug: string; title: string } | null
export type ZoomImage = { src: string; alt: string } | null

// The active section is the last heading that has scrolled past 30% of the screen, so
// jumps and contents clicks land on the right item. Scroll work is batched per frame.
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)
  const key = ids.join(",")
  useEffect(() => {
    const list = key ? key.split(",") : []
    if (!list.length) return
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.3
      let current = list[0]
      for (const id of list) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
        else if (el) break
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [key])
  return active
}

export function TableOfContents({ items, active }: { items: TocItem[]; active: string | null }) {
  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="text-sm font-medium text-muted-foreground">On this page</p>
      <ol className="mt-4 space-y-1 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1 text-sm transition-colors duration-150 ease-soft",
                item.level === 3 ? "pl-8" : "pl-4",
                active === item.id
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
                focusRing,
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

const neighbourCard = cn(
  "group rounded-2xl bg-card p-6 ring-1 ring-border transition-shadow duration-150 ease-soft hover:ring-foreground",
  focusRing,
)

export function PrevNextNav({
  prev,
  next,
  basePath,
  noun,
  className,
}: {
  prev?: ArticleNeighbour
  next?: ArticleNeighbour
  basePath: string
  noun: string
  className?: string
}) {
  if (!prev && !next) return null
  return (
    <nav aria-label={`More ${noun}s`} className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {prev ? (
        <Link href={`${basePath}/${prev.slug}`} className={neighbourCard}>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Icon icon={ArrowLeft01Icon} size={16} />
            Previous {noun}
          </span>
          <span className="mt-2 block text-lg font-medium tracking-tight">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link href={`${basePath}/${next.slug}`} className={cn(neighbourCard, "text-right")}>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            Next {noun}
            <Icon icon={ArrowRight01Icon} size={16} />
          </span>
          <span className="mt-2 block text-lg font-medium tracking-tight">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}

export function ImageZoom({ image, onClose }: { image: ZoomImage; onClose: () => void }) {
  return (
    <Dialog open={image !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] border-0 bg-transparent p-0 shadow-none sm:max-w-[95vw]">
        <DialogTitle className="sr-only">{image?.alt || "Enlarged image"}</DialogTitle>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.src} alt={image.alt} className="max-h-[85dvh] w-full rounded-xl bg-white object-contain" />
        )}
      </DialogContent>
    </Dialog>
  )
}
