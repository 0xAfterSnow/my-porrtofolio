"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowUp01Icon,
  GithubIcon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { GITHUB_USERNAME, type Contributions } from "@/lib/github"
import { Icon } from "@/components/icon"
import { ContributionGraph } from "@/components/contribution-graph"
import { ResumeModal } from "@/components/resume-modal"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Reveal, buttonPrimary, buttonQuiet, focusRing } from "@/components/section"

const EMAIL = "snow@aftersnow.xyz"

const footerLink = cn(
  "inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors duration-300 ease-soft hover:text-foreground",
  focusRing,
)

interface ContactProps {
  mode?: "backend" | "web3"
  contributions: Contributions | null
}

export function Contact({ mode, contributions }: ContactProps) {
  const [showResume, setShowResume] = useState(false)
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
          <div className="grid gap-12 rounded-2xl bg-card p-6 md:p-12 lg:grid-cols-12 lg:gap-12 lg:p-16">
            <div className="flex flex-col lg:col-span-6">
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <h2 className="text-hero mt-4 max-w-[560px] pb-1 text-4xl font-semibold tracking-tighter md:text-5xl">
                Have something that needs building?
              </h2>
              <p className="mt-6 max-w-[480px] text-lg text-muted-foreground">
                {mode === "web3"
                  ? "Tell me about the protocol, the chain, and what the contracts need to guarantee. I'll tell you honestly whether I'm the right fit."
                  : "Tell me about the product, the traffic you expect, and where things hurt today. I'll tell you honestly whether I'm the right fit."}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-2 lg:mt-auto lg:pt-10">
                <a href={`mailto:${EMAIL}`} className={buttonPrimary}>
                  <Icon icon={Mail01Icon} size={18} />
                  Email me
                </a>
                <button type="button" onClick={() => setShowResume(true)} className={buttonQuiet}>
                  Read my resume
                </button>
              </div>
            </div>

            <div className="min-w-0 self-end lg:col-span-6">
              <div className="rounded-xl bg-background ring-1 ring-border">
                <ContributionGraph data={contributions} username={GITHUB_USERNAME} />
              </div>
              <ul className="mt-3 flex items-center gap-2">
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

      <ResumeModal open={showResume} onOpenChange={setShowResume} mode={mode || "backend"} />
    </>
  )
}
