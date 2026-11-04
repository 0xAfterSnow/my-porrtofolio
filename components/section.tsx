"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export { focusRing, buttonPrimary, buttonQuiet, iconButton } from "@/lib/styles"

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

// Content is visible as soon as the server sends it. After hydration, only blocks still
// below the screen are hidden, and each fades in just before it scrolls into view.
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<"shown" | "pending" | "revealed">("shown")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    setState("pending")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("revealed")
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px 15% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(state === "pending" && "reveal-pending", state === "revealed" && "reveal-in", className)}
      style={state === "revealed" && delay ? { animationDelay: `${Math.min(delay, 120)}ms` } : undefined}
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
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{title}</h2>
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
