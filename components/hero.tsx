"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowDown01Icon, Mail01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { GitHubLogo, LinkedInLogo, XLogo } from "@/components/brand-logos"
import { ResumeModal } from "@/components/resume-modal"
import { ContributionGraph } from "@/components/contribution-graph"
import { GITHUB_USERNAME, type Contributions } from "@/lib/github"
import { Reveal, buttonPrimary, buttonQuiet, iconButton } from "@/components/section"

interface HeroProps {
  mode: "backend" | "web3"
  avatarUrl?: string | null
  contributions: Contributions | null
}

const content: Record<HeroProps["mode"], {
  role: string
  statement: string
  intro: string
  status: string
}> = {
  backend: {
    role: "Backend engineer",
    statement: "Backend systems for products that can't afford downtime",
    intro:
      "I design the APIs, data models, and infrastructure behind products that need to grow without falling over. Mostly Python and Django, on Postgres.",
    status: "Senior backend developer at Asterverse",
  },
  web3: {
    role: "Smart contract developer",
    statement: "Smart contracts for protocols that hold real money",
    intro:
      "I write, test, and audit Solidity for marketplaces, wagering protocols, and onchain ad networks, across EVM chains and Algorand.",
    status: "Smart contract developer, most recently at AdChain",
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

export function Hero({ mode, avatarUrl, contributions }: HeroProps) {
  const [showResume, setShowResume] = useState(false)
  const copy = content[mode]
  const time = useLocalTime("Africa/Lagos")

  return (
    <section id="top" className="flex min-h-[100dvh] flex-col justify-center pt-32 pb-16">
      {/* One entrance for the whole hero. */}
      <Reveal className="mx-auto w-full max-w-6xl px-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="text-foreground">{copy.status}</span>
          <span aria-hidden>·</span>
          <span className="font-mono text-xs tabular-nums">Nigeria {time ? `${time} WAT` : "UTC+1"}</span>
        </p>

        <h1
          aria-label={`Shagbaor Agber, ${copy.role}`}
          className="mt-8 flex flex-wrap items-center gap-x-4 text-6xl leading-none font-medium tracking-tighter sm:gap-x-6 sm:text-8xl lg:text-9xl"
        >
          {avatarUrl && (
            <span className="relative block size-14 shrink-0 overflow-hidden rounded-2xl bg-card ring-1 ring-border sm:size-20 lg:size-28">
              <Image src={avatarUrl} alt="" fill priority sizes="112px" className="object-cover" />
            </span>
          )}
          <span aria-hidden className="pb-2">
            Shagbaor Agber
          </span>
        </h1>

        <div className="mt-12 grid items-center gap-12 border-t border-border pt-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-2xl font-medium tracking-tight md:text-3xl">{copy.statement}</p>
            <p className="mt-6 max-w-[480px] text-lg text-muted-foreground">{copy.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <a href="#projects" className={buttonPrimary}>
                See selected work
                <Icon icon={ArrowDown01Icon} size={16} />
              </a>
              <button type="button" onClick={() => setShowResume(true)} className={buttonQuiet}>
                Read my resume
              </button>
            </div>
            <ul className="mt-6 -ml-2 flex items-center">
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

          {/* The one rich moment: real commit history. */}
          <figure className="min-w-0 lg:col-span-7">
            <div className="rounded-xl bg-card p-1 ring-1 ring-border">
              <div className="rounded-lg bg-background ring-1 ring-border">
                <ContributionGraph data={contributions} username={GITHUB_USERNAME} />
              </div>
            </div>
            <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm transition-colors duration-150 ease-soft hover:text-foreground"
              >
                github.com/{GITHUB_USERNAME}
              </a>
            </figcaption>
          </figure>
        </div>

        <div className="mt-16 flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
          <p className="shrink-0 text-sm text-muted-foreground">Built with</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {teams.map((team) => (
              <li key={team} className="text-sm font-medium text-muted-foreground">
                {team}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <ResumeModal open={showResume} onOpenChange={setShowResume} mode={mode} />
    </section>
  )
}
