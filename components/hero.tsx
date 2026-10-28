"use client"

import { useEffect, useState } from "react"
import {
  ArrowDown01Icon,
  GithubIcon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { ResumeModal } from "@/components/resume-modal"
import { Reveal, buttonPrimary, buttonQuiet, iconButton } from "@/components/section"

interface HeroProps {
  mode: "backend" | "web3"
}

const content = {
  backend: {
    role: "Backend engineer",
    lines: ["Backend systems", "for products that", "can't afford downtime"],
    intro:
      "I design the APIs, data models, and infrastructure behind products that need to grow without falling over. Mostly Python and Django, on Postgres.",
    stats: [
      { value: "5+", label: "years in production" },
      { value: "5", label: "backend teams" },
      { value: "99.99%", label: "uptime held" },
    ],
    current: { label: "Currently", value: "Senior backend developer", at: "Asterverse" },
    stack: "Python · Django · PostgreSQL",
  },
  web3: {
    role: "Smart contract developer",
    lines: ["Smart contracts", "for protocols that", "hold real money"],
    intro:
      "I write, test, and audit Solidity for marketplaces, wagering protocols, and onchain ad networks, across EVM chains and Algorand.",
    stats: [
      { value: "1st", label: "Algorand Global Hackathon" },
      { value: "90%+", label: "contract test coverage" },
      { value: "6", label: "contracts for Secuda" },
    ],
    current: { label: "Latest", value: "Smart contract developer", at: "AdChain" },
    stack: "Solidity · Hardhat · Ethers.js",
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
  { href: "https://github.com/0xAfterSnow/", label: "GitHub", icon: GithubIcon },
  { href: "https://linkedin.com/in/shagbaoragber/", label: "LinkedIn", icon: Linkedin01Icon },
  { href: "https://x.com/0xAfterSnow", label: "X", icon: NewTwitterIcon },
  { href: "mailto:snow@aftersnow.xyz", label: "Email", icon: Mail01Icon },
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

function ProfileCard({ mode }: HeroProps) {
  const copy = content[mode]
  const time = useLocalTime("Africa/Lagos")

  const rows = [
    { label: "Based in", value: "Nigeria" },
    { label: "Local time", value: time ? `${time} WAT` : "WAT, UTC+1" },
    { label: copy.current.label, value: `${copy.current.value}, ${copy.current.at}` },
    { label: "Works in", value: copy.stack },
  ]

  return (
    <div className="rounded-2xl bg-card p-2 ring-1 ring-border">
      <div className="flex items-center gap-4 rounded-lg bg-background p-4 ring-1 ring-border">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-foreground text-base font-semibold tracking-tight text-background"
        >
          SA
        </span>
        <div className="min-w-0">
          <p className="text-base font-semibold">Shagbaor Agber</p>
          <p className="text-sm text-muted-foreground">{copy.role}</p>
        </div>
      </div>
      <dl className="px-4 py-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-0"
          >
            <dt className="shrink-0 text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-right text-sm font-medium tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function Hero({ mode }: HeroProps) {
  const [showResume, setShowResume] = useState(false)
  const copy = content[mode]

  return (
    <section id="top" className="flex min-h-[100dvh] flex-col justify-center pt-32 pb-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <Reveal>
              <h1 className="text-hero max-w-3xl pb-2 text-4xl font-semibold tracking-tighter sm:text-5xl md:text-6xl">
                {copy.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-6 max-w-[560px] text-lg text-muted-foreground">{copy.intro}</p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <a href="#projects" className={buttonPrimary}>
                  See selected work
                  <Icon icon={ArrowDown01Icon} size={16} />
                </a>
                <button type="button" onClick={() => setShowResume(true)} className={buttonQuiet}>
                  Read my resume
                </button>
                <ul className="flex items-center sm:ml-2 sm:border-l sm:border-border sm:pl-2">
                  {socials.map(({ href, label, icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        aria-label={label}
                        className={iconButton}
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        <Icon icon={icon} size={18} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <dl className="mt-16 grid max-w-[560px] grid-cols-3 gap-6">
                {copy.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse justify-end">
                    <dt className="mt-1 text-sm text-muted-foreground">{stat.label}</dt>
                    <dd className="text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={200} className="min-w-0 lg:col-span-4">
            <ProfileCard mode={mode} />
          </Reveal>
        </div>
      </div>

      <Reveal delay={400} className="mt-20">
        <p className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground">Teams and clients I've built with</p>
        <div className="marquee mt-6">
          <p className="sr-only">{teams.join(", ")}</p>
          <ul className="marquee-track" aria-hidden>
            {[...teams, ...teams].map((team, i) => (
              <li
                key={i}
                className="shrink-0 px-8 text-xl font-semibold tracking-tight text-muted-foreground/70 md:text-2xl"
              >
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
