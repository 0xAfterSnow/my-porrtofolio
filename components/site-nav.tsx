"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { focusRing, iconButton } from "@/components/section"

type Mode = "backend" | "web3"

interface SiteNavProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
}

const links = [
  { href: "#projects", id: "projects", label: "Work" },
  { href: "#experience", id: "experience", label: "Experience" },
  { href: "#about", id: "about", label: "About" },
  { href: "#contact", id: "contact", label: "Contact" },
]

function ModeSwitch({ mode, onModeChange }: SiteNavProps) {
  return (
    <div role="radiogroup" aria-label="Portfolio focus" className="relative grid grid-cols-2 rounded-full bg-secondary p-1">
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-background shadow-sm transition-transform duration-500 ease-soft",
          mode === "web3" && "translate-x-full",
        )}
      />
      {(["backend", "web3"] as const).map((value) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          onClick={() => onModeChange(value)}
          className={cn(
            "relative rounded-full px-3 py-1 text-sm font-semibold transition-colors duration-300 ease-soft",
            mode === value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            focusRing,
          )}
        >
          {value === "backend" ? "Backend" : "Web3"}
        </button>
      ))}
    </div>
  )
}

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme === "dark"
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={iconButton}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export function SiteNav({ mode, onModeChange }: SiteNavProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    // "top" (the hero) has no link, so reaching it clears the highlight.
    ;["top", ...links.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [mode])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <header className="fixed inset-x-4 top-4 z-50 flex justify-center">
        <nav
          aria-label="Main"
          className="flex w-full items-center justify-between gap-2 rounded-full border border-border/60 bg-background/70 py-1 pr-1 pl-4 backdrop-blur-xl md:w-auto md:gap-4"
        >
          <a href="#top" className={cn("rounded-md text-sm font-semibold tracking-tight", focusRing)}>
            Shagbaor
          </a>

          <ul className="hidden items-center md:flex">
            {links.map(({ href, id, label }) => (
              <li key={id}>
                <a
                  href={href}
                  aria-current={active === id ? "location" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300 ease-soft",
                    active === id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    focusRing,
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/blog"
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors duration-300 ease-soft hover:text-foreground",
                  focusRing,
                )}
              >
                Blog
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-1">
            <ModeSwitch mode={mode} onModeChange={onModeChange} />
            <div className="hidden md:block">
              <ThemeButton />
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(iconButton, "relative md:hidden")}
            >
              <span
                className={cn(
                  "absolute h-0.5 w-4 rounded-full bg-current transition-transform duration-500 ease-soft",
                  open ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                className={cn(
                  "absolute h-0.5 w-4 rounded-full bg-current transition-transform duration-500 ease-soft",
                  open ? "-rotate-45" : "translate-y-1",
                )}
              />
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-background/95 px-6 pt-24 pb-12 backdrop-blur-2xl transition-opacity duration-300 ease-soft md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ul className="space-y-2">
          {[...links.map(({ href, label }) => ({ href, label })), { href: "/blog", label: "Blog" }].map(
            ({ href, label }, i) => (
              <li
                key={href}
                className={cn(
                  "transition-[opacity,transform] duration-500 ease-soft",
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: open ? `${Math.min(i * 60, 340)}ms` : "0ms" }}
              >
                <a
                  href={href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className={cn("block rounded-lg py-2 text-3xl font-semibold tracking-tight", focusRing)}
                >
                  {label}
                </a>
              </li>
            ),
          )}
        </ul>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeButton />
        </div>
      </div>
    </>
  )
}
