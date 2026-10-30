"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  Award01Icon,
  ChampionIcon,
  GitBranchIcon,
  PulseRectangle01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Icon, type IconType } from "@/components/icon"
import { Reveal, Section } from "@/components/section"

interface AchievementsProps {
  mode: "backend" | "web3"
}

type Win = {
  icon: IconType
  kind: string
  title: string
  org: string
  story: string
  year: string
  mode: AchievementsProps["mode"]
  image?: string
}

type Cert = { title: string; issuer: string; year: string; mode: AchievementsProps["mode"] }

const wins: Win[] = [
  {
    icon: ChampionIcon,
    kind: "1st place",
    title: "Algorand Global Hackathon",
    org: "Algorand",
    story: "Won with Secuda, a peer to peer marketplace for trading smart insurance covers.",
    year: "2024",
    mode: "web3",
    image: "/secuda.png",
  },
  {
    icon: Award01Icon,
    kind: "Community Choice Award",
    title: "Crypto Cities Hackathon",
    org: "Voted by the community",
    story: "Voted the best project by the hackathon community.",
    year: "2025",
    mode: "web3",
  },
  {
    icon: GitBranchIcon,
    kind: "Maintainer",
    title: "AmongFriends Protocol",
    org: "Open protocol",
    story: "Maintaining a protocol for peer to peer wagering without a middleman.",
    year: "2025",
    mode: "web3",
    image: "/web3-betting-dapp.jpg",
  },
  {
    icon: PulseRectangle01Icon,
    kind: "99.99% uptime",
    title: "Critical production systems",
    org: "Backend operations",
    story: "Kept critical systems available for more than a year straight.",
    year: "2024",
    mode: "backend",
  },
]

const certs: Cert[] = [
  { title: "EDU Chain Developer Certificate", issuer: "EDU Chain", year: "2025", mode: "web3" },
  { title: "Ethereum Developer Certification", issuer: "Alchemy University", year: "2024", mode: "web3" },
  { title: "Greenfield Certificate", issuer: "HackQuest", year: "2024", mode: "web3" },
  { title: "Automate with Python", issuer: "Udemy", year: "2024", mode: "backend" },
  { title: "Python Web Scraping and Automation", issuer: "Udemy", year: "2024", mode: "backend" },
  { title: "PyTorch Ultimate Bootcamp", issuer: "Udemy", year: "2024", mode: "backend" },
  { title: "Django for Everybody Specialization", issuer: "University of Michigan", year: "2023", mode: "backend" },
  { title: "GitHub Actions for CI/CD Pipelines", issuer: "Professional certification", year: "2023", mode: "backend" },
]

const pad = (n: number) => String(n + 1).padStart(2, "0")

// Floating preview that trails the cursor while a row is hovered (mouse only).
function HoverPreview({ win }: { win: Win | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const last = useRef<Win | null>(null)
  if (win) last.current = win
  const shown = last.current

  useEffect(() => {
    let frame = 0
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15
      pos.current.y += (target.current.y - pos.current.y) * 0.15
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x + 24}px, ${pos.current.y - 120}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener("pointermove", onMove)
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed top-0 left-0 z-40 hidden [@media(hover:hover)]:block">
      <div
        className={cn(
          "w-72 rounded-2xl bg-card p-2 shadow-[0_24px_64px_-24px_rgb(0_0_0/0.5)] ring-1 ring-border transition-[opacity,transform] duration-500 ease-soft",
          win ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      >
        {shown && (
          <>
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-background">
              {shown.image ? (
                <Image src={shown.image} alt="" fill sizes="288px" className="object-cover" />
              ) : (
                <Icon icon={shown.icon} size={48} className="text-muted-foreground" />
              )}
            </div>
            <p className="px-2 pt-3 pb-2 text-sm text-muted-foreground">{shown.story}</p>
          </>
        )}
      </div>
    </div>
  )
}

export function Achievements({ mode }: AchievementsProps) {
  const [active, setActive] = useState<number | null>(null)
  // Wins show in both modes, with the current mode's first.
  const ordered = [...wins.filter((w) => w.mode === mode), ...wins.filter((w) => w.mode !== mode)]
  const modeCerts = certs.filter((c) => c.mode === mode)

  return (
    <Section id="recognition" label="Recognition" title="Wins, roles, and certifications">
      <ol className="border-t border-border" onMouseLeave={() => setActive(null)}>
        {ordered.map((win, i) => (
          <li key={win.title}>
            <Reveal delay={Math.min(i * 60, 240)}>
              <article
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "relative grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-1 border-b border-border py-6 transition-opacity duration-500 ease-soft md:grid-cols-12 md:items-baseline md:gap-8 md:py-8",
                  active !== null && active !== i && "opacity-40",
                )}
              >
                <span className="font-mono text-sm text-muted-foreground md:col-span-1">{pad(i)}</span>
                <h3
                  className={cn(
                    "text-2xl font-semibold tracking-tight transition-transform duration-500 ease-soft md:col-span-6 md:text-3xl",
                    active === i && "md:translate-x-2",
                  )}
                >
                  {win.kind}
                  <span className="text-muted-foreground"> · {win.title}</span>
                </h3>
                <span className="text-sm text-muted-foreground tabular-nums md:order-last md:col-span-2 md:text-right">
                  {win.year}
                </span>
                <p className="col-start-2 col-end-4 inline-flex items-center gap-2 text-sm text-muted-foreground md:col-span-3">
                  <Icon icon={win.icon} size={16} />
                  {win.org}
                </p>
                <p className="col-start-2 col-end-4 mt-2 text-sm text-muted-foreground md:hidden">{win.story}</p>
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-px left-0 h-px w-full origin-left bg-foreground transition-transform duration-700 ease-soft",
                    active === i ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </article>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-20 grid gap-6 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-3">
          <h3 className="text-sm font-medium text-muted-foreground">Certifications</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {modeCerts.length} {mode === "backend" ? "backend" : "Web3"} courses and programs
          </p>
        </Reveal>
        <ol className="grid gap-x-8 sm:grid-cols-2 md:col-span-9">
          {modeCerts.map((cert, i) => (
            <li key={cert.title}>
              <Reveal delay={(i % 2) * 60}>
                <div className="flex items-baseline gap-4 border-b border-border py-4">
                  <span className="font-mono text-xs text-muted-foreground">{pad(i)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium">{cert.title}</p>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">{cert.year}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <HoverPreview win={active !== null ? ordered[active] : null} />
    </Section>
  )
}
