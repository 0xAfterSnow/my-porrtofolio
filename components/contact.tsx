"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowUp01Icon,
  Calendar03Icon,
  GithubIcon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { GITHUB_USERNAME, type Contributions } from "@/lib/github"
import { Icon } from "@/components/icon"
import { ContributionGraph } from "@/components/contribution-graph"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Reveal, focusRing } from "@/components/section"

const EMAIL = "snow@aftersnow.xyz"
// Swap for a Cal.com or Calendly link when there is one.
const BOOKING_URL = `mailto:${EMAIL}?subject=${encodeURIComponent("Let's book a call")}`

const smallButton = cn(
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-[transform,background-color,border-color] duration-300 ease-soft active:scale-[0.98]",
  focusRing,
)

const footerLink = cn(
  "inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors duration-300 ease-soft hover:text-foreground",
  focusRing,
)

interface ContactProps {
  mode?: "backend" | "web3"
  contributions: Contributions | null
}

export function Contact({ contributions }: ContactProps) {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createBrowserSupabaseClient()
      const { data } = await supabase.from("site_settings").select("*").single()
      if (data) setSettings(data)
    }
    fetchSettings()
  }, [])

  const socials = [
    { label: "GitHub", icon: GithubIcon, href: `https://github.com/${GITHUB_USERNAME}` },
    { label: "LinkedIn", icon: Linkedin01Icon, href: settings?.social_linkedin || "https://linkedin.com/in/shagbaoragber/" },
    { label: "X", icon: NewTwitterIcon, href: settings?.social_twitter || "https://x.com/0xAfterSnow" },
  ]

  return (
    <>
      <section id="contact" className="scroll-mt-24 px-6 pt-24 pb-24">
        <Reveal className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold tracking-tight">Contact.</h2>

          <div className="mt-6 w-full max-w-[784px] rounded-xl bg-card p-1 ring-1 ring-border">
            <div className="rounded-lg bg-background ring-1 ring-border">
              <ContributionGraph data={contributions} username={GITHUB_USERNAME} />
            </div>

            <div className="flex flex-wrap items-center gap-2 p-2 pt-3">
              <a href={BOOKING_URL} className={cn(smallButton, "bg-foreground text-background hover:bg-foreground/85")}>
                <Icon icon={Calendar03Icon} size={16} />
                Book a call
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className={cn(smallButton, "bg-background text-foreground ring-1 ring-border hover:bg-secondary")}
              >
                <Icon icon={Mail01Icon} size={16} />
                Send an email
              </a>
              <ul className="flex items-center gap-2">
                {socials.map(({ label, icon, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border transition-[transform,background-color,color] duration-300 ease-soft hover:bg-secondary hover:text-foreground active:scale-[0.98]",
                        focusRing,
                      )}
                    >
                      <Icon icon={icon} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="px-6 pb-24 md:pb-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings?.author_name || "Shagbaor Agber"}
          </p>
          <ul className="-ml-2 flex flex-wrap items-center gap-1">
            <li>
              <Link href="/blog" className={footerLink}>
                Blog
              </Link>
            </li>
            <li>
              <a href="#top" className={footerLink}>
                Back to top
                <Icon icon={ArrowUp01Icon} size={14} />
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
