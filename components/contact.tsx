"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUp, ArrowUpRight, Check, Copy, EnvelopeSimple } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { ResumeModal } from "@/components/resume-modal"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Reveal, buttonPrimary, buttonQuiet, focusRing, iconButton } from "@/components/section"

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
  const socials = [
    { label: "GitHub", href: settings?.social_github || "https://github.com/CodeShagbaor/" },
    { label: "LinkedIn", href: settings?.social_linkedin || "https://linkedin.com/in/shagbaoragber/" },
    { label: "X", href: settings?.social_twitter || "https://x.com/CodeShagbaor" },
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
        <Reveal className="mx-auto max-w-6xl rounded-2xl bg-card px-6 py-16 md:px-16 md:py-24">
          <h2 className="max-w-[680px] text-4xl font-semibold tracking-tight md:text-5xl">
            Have something that needs building?
          </h2>
          <p className="mt-6 max-w-[560px] text-lg text-muted-foreground">
            {mode === "web3"
              ? "Tell me about the protocol, the chain, and what the contracts need to guarantee. I'll tell you honestly whether I'm the right fit."
              : "Tell me about the product, the traffic you expect, and where things hurt today. I'll tell you honestly whether I'm the right fit."}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <a href={`mailto:${email}`} className={buttonPrimary}>
              <EnvelopeSimple size={18} weight="bold" />
              Email me
            </a>
            <button type="button" onClick={() => setShowResume(true)} className={buttonQuiet}>
              Read my resume
            </button>
          </div>

          <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono">{email}</span>
            <button
              type="button"
              onClick={copyEmail}
              className={cn(iconButton, "size-8")}
              aria-label={copied ? "Email address copied" : "Copy email address"}
            >
              {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
            </button>
            <span role="status" className="sr-only">
              {copied ? "Email address copied" : ""}
            </span>
          </div>
        </Reveal>
      </section>

      <footer className="px-6 pb-24 md:pb-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings?.author_name || "Shagbaor Agber"}
          </p>
          <ul className="-ml-2 flex flex-wrap items-center gap-1">
            {socials.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors duration-300 ease-soft hover:text-foreground",
                    focusRing,
                  )}
                >
                  {label}
                  <ArrowUpRight size={12} />
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/blog"
                className={cn(
                  "inline-flex rounded-md px-2 py-1 transition-colors duration-300 ease-soft hover:text-foreground",
                  focusRing,
                )}
              >
                Blog
              </Link>
            </li>
            <li>
              <a
                href="#top"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors duration-300 ease-soft hover:text-foreground",
                  focusRing,
                )}
              >
                Back to top
                <ArrowUp size={12} />
              </a>
            </li>
          </ul>
        </div>
      </footer>

      <ResumeModal open={showResume} onOpenChange={setShowResume} mode={mode || "backend"} />
    </>
  )
}
