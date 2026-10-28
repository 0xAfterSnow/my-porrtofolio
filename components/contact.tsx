"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowUp01Icon,
  ArrowUpRight01Icon,
  Copy01Icon,
  GithubIcon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"
import { ResumeModal } from "@/components/resume-modal"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Reveal, buttonPrimary, buttonQuiet, focusRing, iconButton } from "@/components/section"

const handle = (url: string) => "@" + url.replace(/\/+$/, "").split("/").pop()

const footerLink = cn(
  "inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors duration-300 ease-soft hover:text-foreground",
  focusRing,
)

export function Contact({ mode }: { mode?: "backend" | "web3" }) {
  const [showResume, setShowResume] = useState(false)
  const [settings, setSettings] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createBrowserSupabaseClient()
      const { data } = await supabase.from("site_settings").select("*").single()
      if (data) setSettings(data)
    }
    fetchSettings()
  }, [])

  const email = settings?.social_email || "snow@aftersnow.xyz"
  const channels = [
    { label: "LinkedIn", icon: Linkedin01Icon, href: settings?.social_linkedin || "https://linkedin.com/in/shagbaoragber/" },
    { label: "GitHub", icon: GithubIcon, href: settings?.social_github || "https://github.com/CodeShagbaor/" },
    { label: "X", icon: NewTwitterIcon, href: settings?.social_twitter || "https://x.com/CodeShagbaor" },
  ]

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <>
      <section id="contact" className="scroll-mt-24 px-6 pt-24 pb-24">
        <Reveal className="mx-auto max-w-6xl">
          <div className="grid gap-12 rounded-2xl bg-card p-6 md:p-12 lg:grid-cols-12 lg:gap-12 lg:p-16">
            <div className="flex flex-col lg:col-span-7">
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
                <a href={`mailto:${email}`} className={buttonPrimary}>
                  <Icon icon={Mail01Icon} size={18} />
                  Email me
                </a>
                <button type="button" onClick={() => setShowResume(true)} className={buttonQuiet}>
                  Read my resume
                </button>
              </div>
            </div>

            <ul className="self-end rounded-xl bg-background p-2 ring-1 ring-border lg:col-span-5">
              <li className="flex items-center gap-4 rounded p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Icon icon={Mail01Icon} size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">Email</span>
                  <span className="block truncate font-mono text-sm text-muted-foreground">{email}</span>
                </span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className={iconButton}
                  aria-label={copied ? "Email address copied" : "Copy email address"}
                >
                  <Icon icon={copied ? Tick02Icon : Copy01Icon} size={18} className={cn(copied && "text-emerald-500")} />
                </button>
                <span role="status" className="sr-only">
                  {copied ? "Email address copied" : ""}
                </span>
              </li>
              {channels.map(({ label, icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center gap-4 rounded p-4 transition-colors duration-300 ease-soft hover:bg-card",
                      focusRing,
                    )}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Icon icon={icon} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="block truncate text-sm text-muted-foreground">{handle(href)}</span>
                    </span>
                    <Icon
                      icon={ArrowUpRight01Icon}
                      size={18}
                      className="mr-3 text-muted-foreground transition-transform duration-500 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                    />
                  </a>
                </li>
              ))}
            </ul>
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
