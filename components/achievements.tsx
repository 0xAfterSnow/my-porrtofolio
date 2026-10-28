"use client"

import {
  Award01Icon,
  Certificate01Icon,
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
  featured?: boolean
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
    featured: true,
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
    year: "2025 – now",
    mode: "web3",
  },
  {
    icon: PulseRectangle01Icon,
    kind: "99.99% uptime",
    title: "Critical production systems",
    org: "Backend operations",
    story: "Kept critical systems available for more than a year straight.",
    year: "2023 – 2024",
    mode: "backend",
    featured: true,
  },
]

const certs: Cert[] = [
  { title: "EDU Chain Developer Certificate", issuer: "EDU Chain", year: "2025", mode: "web3" },
  { title: "Ethereum Developer Certification", issuer: "Alchemy University", year: "2024", mode: "web3" },
  { title: "Greenfield Certificate", issuer: "HackQuest", year: "2024", mode: "web3" },
  { title: "Automate with Python", issuer: "Udemy", year: "2024", mode: "backend" },
  { title: "Python Web Scraping and Automation with BS4 and Selenium", issuer: "Udemy", year: "2024", mode: "backend" },
  { title: "PyTorch Ultimate Bootcamp: Python Deep Learning", issuer: "Udemy", year: "2024", mode: "backend" },
  { title: "Django for Everybody Specialization", issuer: "University of Michigan", year: "2023", mode: "backend" },
  { title: "GitHub Actions for CI/CD DevOps Pipelines", issuer: "Professional certification", year: "2023", mode: "backend" },
]

export function Achievements({ mode }: AchievementsProps) {
  // Wins are shown in both modes, with the current mode's first.
  const orderedWins = [...wins.filter((w) => w.mode === mode), ...wins.filter((w) => w.mode !== mode)]
  const modeCerts = certs.filter((c) => c.mode === mode)

  return (
    <Section id="recognition" label="Recognition" title="Wins, roles, and the work behind them">
      <ol className="border-t border-border">
        {orderedWins.map((win, i) => {
          const lead = win.featured && win.mode === mode
          return (
            <li key={win.title}>
              <Reveal delay={Math.min(i * 60, 240)}>
                <article className="group grid gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8">
                  <p className="text-sm text-muted-foreground tabular-nums md:col-span-3 md:pt-1">{win.year}</p>
                  <div className="md:col-span-5">
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Icon icon={win.icon} size={16} />
                      {win.org}
                    </p>
                    <h3
                      className={cn(
                        "mt-2 font-semibold tracking-tight transition-transform duration-500 ease-soft group-hover:translate-x-1",
                        lead ? "text-3xl md:text-4xl" : "text-2xl",
                      )}
                    >
                      <span className={cn("block", lead && "text-hero")}>{win.kind}</span>
                      <span className="block text-muted-foreground">{win.title}</span>
                    </h3>
                  </div>
                  <p className="text-base text-muted-foreground md:col-span-4 md:pt-8">{win.story}</p>
                </article>
              </Reveal>
            </li>
          )
        })}
      </ol>

      <div className="mt-16 grid gap-6 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {mode === "backend" ? "Backend certifications" : "Web3 certifications"}
          </h3>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 md:col-span-9 lg:grid-cols-3">
          {modeCerts.map((cert, i) => (
            <li key={cert.title}>
              <Reveal delay={Math.min(i * 60, 240)} className="h-full">
                <article className="flex h-full flex-col rounded-2xl bg-card p-6 transition-transform duration-500 ease-soft hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-background ring-1 ring-border">
                      <Icon icon={Certificate01Icon} size={20} />
                    </span>
                    <span className="text-sm text-muted-foreground tabular-nums">{cert.year}</span>
                  </div>
                  <h4 className="mt-8 text-base font-semibold">{cert.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
