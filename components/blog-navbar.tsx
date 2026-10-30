"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"
import { focusRing, iconButton } from "@/components/section"

const links = [
  { href: "/#projects", label: "Work", key: "work" },
  { href: "/#about", label: "About", key: "about" },
  { href: "/#contact", label: "Contact", key: "contact" },
]

const linkClass = cn(
  "rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300 ease-soft",
  focusRing,
)

export function BlogNavbar({ current = "blog" }: { current?: "blog" | "work" }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = !mounted || resolvedTheme === "dark"

  return (
    <header className="fixed inset-x-4 top-4 z-50 flex justify-center">
      <nav
        aria-label="Main"
        className="flex w-full items-center justify-between gap-2 rounded-full border border-border/60 bg-background/70 py-1 pr-1 pl-4 backdrop-blur-xl md:w-auto md:gap-4"
      >
        <Link href="/" className={cn("rounded-md text-sm font-semibold tracking-tight", focusRing)}>
          Shagbaor
        </Link>
        <ul className="flex items-center">
          {links.map(({ href, label, key }) => (
            <li key={href} className="hidden sm:block">
              <Link
                href={href}
                aria-current={current === key ? "page" : undefined}
                className={cn(linkClass, current === key ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/blog"
              aria-current={current === "blog" ? "page" : undefined}
              className={cn(linkClass, current === "blog" ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Blog
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={iconButton}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              <Icon icon={isDark ? Sun03Icon : Moon02Icon} />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
