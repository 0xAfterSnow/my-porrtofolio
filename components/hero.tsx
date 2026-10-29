"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowDown01Icon, Mail01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { GitHubLogo, LinkedInLogo, XLogo } from "@/components/brand-logos"
import { ResumeModal } from "@/components/resume-modal"
import { Reveal, buttonPrimary, buttonQuiet, iconButton } from "@/components/section"

interface HeroProps {
  mode: "backend" | "web3"
  avatarUrl?: string | null
}

const content: Record<HeroProps["mode"], {
  role: string
  statement: string
  intro: string
  status: { live: boolean; text: string }
}> = {
  backend: {
    role: "Backend engineer",
    statement: "Backend systems for products that can't afford downtime.",
    intro:
      "I design the APIs, data models, and infrastructure behind products that need to grow without falling over. Mostly Python and Django, on Postgres.",
    status: { live: true, text: "Now senior backend developer at Asterverse" },
  },
  web3: {
    role: "Smart contract developer",
    statement: "Smart contracts for protocols that hold real money.",
    intro:
      "I write, test, and audit Solidity for marketplaces, wagering protocols, and onchain ad networks, across EVM chains and Algorand.",
    status: { live: false, text: "Latest: smart contract developer at AdChain" },
  },
}

const teams = [
  "Asterverse",
  "AdChain",
  "Secuda",
  "Claadme",
  "AmongFriends",
  "Mediconnect",
  "Sandlip Oasis",
  "Ceto Data Works",
  "Better Life Nija",
]

const socials = [
  { href: "https://github.com/0xAfterSnow/", label: "GitHub", logo: <GitHubLogo size={18} /> },
  { href: "https://linkedin.com/in/shagbaoragber/", label: "LinkedIn", logo: <LinkedInLogo size={17} /> },
  { href: "https://x.com/0xAfterSnow", label: "X", logo: <XLogo size={16} /> },
  { href: "mailto:snow@aftersnow.xyz", label: "Email", logo: <Icon icon={Mail01Icon} size={18} /> },
]

function useLocalTime(timeZone: string) {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date())
    setTime(format())
    const id = setInterval(() => setTime(format()), 30_000)
    return () => clearInterval(id)
  }, [timeZone])
  return time
}

export function Hero({ mode, avatarUrl }: HeroProps) {
  const [showResume, setShowResume] = useState(false)
  const copy = content[mode]
  const time = useLocalTime("Africa/Lagos")

  return (
    <section id="top" className="flex min-h-[100dvh] flex-col justify-center pt-32 pb-12">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-card py-1 pr-3 pl-2 text-foreground ring-1 ring-border">
              <span className="relative flex size-2">
                {copy.status.live && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
                )}
                <span
                  className={`relative inline-flex size-2 rounded-full ${copy.status.live ? "bg-emerald-500" : "bg-muted-foreground"}`}
                />
              </span>
              {copy.status.text}
            </span>
            <span className="tabular-nums">Nigeria · {time ? `${time} WAT` : "UTC+1"}</span>
          </div>
        </Reveal>

        <h1 aria-label={`Shagbaor Agber, ${copy.role}`} className="mt-8">
          <span
            aria-hidden
            className="flex flex-wrap items-center gap-x-4 pb-2 text-6xl font-semibold leading-none tracking-tighter sm:gap-x-6 sm:text-8xl lg:text-9xl"
          >
            {avatarUrl && (
              <span className="inline-block overflow-hidden">
                <span className="name-rise relative block size-14 overflow-hidden rounded-2xl bg-card ring-1 ring-border sm:size-20 lg:size-28">
                  <Image src={avatarUrl} alt="" fill priority sizes="112px" className="object-cover" />
                </span>
              </span>
            )}
            {["Shagbaor", "Agber"].map((word, i) => (
              <span key={word} className="inline-block overflow-hidden pr-[0.04em]">
                <span
                  className="name-rise text-hero inline-block pb-[0.06em]"
                  style={{ animationDelay: `${(i + 1) * 120}ms` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-12 grid gap-8 border-t border-border pt-8 lg:grid-cols-12 lg:gap-12">
          <Reveal delay={200} className="lg:col-span-5">
            <p className="max-w-[440px] text-2xl font-semibold tracking-tight md:text-3xl">{copy.statement}</p>
          </Reveal>
          <Reveal delay={300} className="lg:col-span-7">
            <p className="max-w-[560px] text-lg text-muted-foreground">{copy.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <a href="#projects" className={buttonPrimary}>
                See selected work
                <Icon icon={ArrowDown01Icon} size={16} />
              </a>
              <button type="button" onClick={() => setShowResume(true)} className={buttonQuiet}>
                Read my resume
              </button>
              <ul className="flex items-center sm:ml-2 sm:border-l sm:border-border sm:pl-2">
                {socials.map(({ href, label, logo }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className={iconButton}
                      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {logo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

      </div>

      <Reveal delay={500} className="mt-12">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-6">
          <p className="hidden shrink-0 text-sm text-muted-foreground md:block">Built with</p>
          <div className="marquee min-w-0 flex-1">
            <p className="sr-only">Teams and clients: {teams.join(", ")}</p>
            <ul className="marquee-track" aria-hidden>
              {[...teams, ...teams].map((team, i) => (
                <li key={i} className="shrink-0 px-6 text-lg font-semibold tracking-tight text-muted-foreground/70">
                  {team}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <ResumeModal open={showResume} onOpenChange={setShowResume} mode={mode} />
    </section>
  )
}
