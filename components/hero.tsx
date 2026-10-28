"use client"

import { useEffect, useRef, useState } from "react"
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

type Stat = { value: number; suffix: string; label: string; decimals?: number }

const content: Record<HeroProps["mode"], {
  role: string
  statement: string
  intro: string
  status: { live: boolean; text: string }
  stats: Stat[]
}> = {
  backend: {
    role: "Backend engineer",
    statement: "Backend systems for products that can't afford downtime.",
    intro:
      "I design the APIs, data models, and infrastructure behind products that need to grow without falling over. Mostly Python and Django, on Postgres.",
    status: { live: true, text: "Now senior backend developer at Asterverse" },
    stats: [
      { value: 5, suffix: "+", label: "Years shipping production backends" },
      { value: 5, suffix: "", label: "Backend teams since 2019" },
      { value: 99.99, suffix: "%", decimals: 2, label: "Uptime held on critical systems" },
    ],
  },
  web3: {
    role: "Smart contract developer",
    statement: "Smart contracts for protocols that hold real money.",
    intro:
      "I write, test, and audit Solidity for marketplaces, wagering protocols, and onchain ad networks, across EVM chains and Algorand.",
    status: { live: false, text: "Latest: smart contract developer at AdChain" },
    stats: [
      { value: 1, suffix: "st", label: "Place at Algorand Global Hackathon" },
      { value: 90, suffix: "%+", label: "Test coverage on contract suites" },
      { value: 6, suffix: "", label: "Contracts shipped for Secuda" },
    ],
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

// Counts up from zero the first time the number scrolls into view.
function CountUp({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value.toFixed(decimals))

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setDisplay((0).toFixed(decimals))

    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const duration = 1400
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 4)
        setDisplay((value * eased).toFixed(decimals))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, decimals])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  )
}

export function Hero({ mode }: HeroProps) {
  const [showResume, setShowResume] = useState(false)
  const copy = content[mode]
  const time = useLocalTime("Africa/Lagos")

  return (
    <section id="top" className="flex min-h-[100dvh] flex-col justify-end pt-32 pb-12">
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
          <span aria-hidden className="block pb-2 text-6xl font-semibold leading-none tracking-tighter sm:text-8xl lg:text-9xl">
            {["Shagbaor", "Agber"].map((word, i) => (
              <span key={word} className="inline-block overflow-hidden pr-[0.08em] align-bottom">
                <span className="name-rise text-hero inline-block pb-[0.06em]" style={{ animationDelay: `${i * 120}ms` }}>
                  {word}
                </span>
                {i === 0 && " "}
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
        </div>

        <Reveal delay={400}>
          <dl className="mt-16 grid grid-cols-3 divide-x divide-border rounded-2xl bg-card ring-1 ring-border">
            {copy.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse justify-end p-4 md:p-6">
                <dt className="mt-2 text-xs text-muted-foreground md:text-sm">{stat.label}</dt>
                <dd className="text-3xl font-semibold tracking-tight md:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
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
