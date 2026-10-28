"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export const buttonPrimary = cn(
  "inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-3 py-2 text-base font-semibold text-background",
  "transition-[transform,background-color] duration-300 ease-soft hover:bg-foreground/85 active:scale-[0.98]",
  focusRing,
)

export const buttonQuiet = cn(
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-base font-semibold text-foreground",
  "transition-[transform,background-color] duration-300 ease-soft hover:bg-secondary active:scale-[0.98]",
  focusRing,
)

export const iconButton = cn(
  "inline-flex size-10 items-center justify-center rounded-full text-muted-foreground",
  "transition-[transform,background-color,color] duration-300 ease-soft hover:bg-secondary hover:text-foreground active:scale-[0.98]",
  focusRing,
)

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

// Rises 32px and fades in the first time it enters the viewport.
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

interface SectionProps {
  id?: string
  label: string
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ id, label, title, description, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 px-6 pt-20 pb-24 md:pt-24 md:pb-24", className)}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 grid gap-4 md:mb-16 md:grid-cols-12 md:gap-8">
          <p className="text-sm font-medium text-muted-foreground md:col-span-3 md:pt-2">{label}</p>
          <div className="max-w-[680px] space-y-4 md:col-span-9">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
