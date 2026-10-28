"use client"

import {
  Award01Icon,
  Certificate01Icon,
  ChampionIcon,
  GitBranchIcon,
  PulseRectangle01Icon,
} from "@hugeicons/core-free-icons"
import { Icon, type IconType } from "@/components/icon"
import { Reveal, Section } from "@/components/section"

interface AchievementsProps {
  mode: "backend" | "web3"
}

type Item = {
  icon: IconType
  title: string
  issuer: string
  year: string
  kind: "Award" | "Role" | "Milestone" | "Certificate"
}

const recognition: Record<AchievementsProps["mode"], { featured: Item & { figure: string; detail: string }; items: Item[] }> = {
  web3: {
    featured: {
      icon: ChampionIcon,
      figure: "1st place",
      title: "Algorand Global Hackathon",
      issuer: "Algorand",
      detail: "Won with Secuda, a peer to peer marketplace for trading smart insurance covers.",
      year: "2024",
      kind: "Award",
    },
    items: [
      { icon: Award01Icon, title: "Community Choice Award", issuer: "Crypto Cities Hackathon", year: "2025", kind: "Award" },
      { icon: GitBranchIcon, title: "Maintainer, AmongFriends Protocol", issuer: "Peer to peer wagering without a middleman", year: "2025", kind: "Role" },
      { icon: Certificate01Icon, title: "EDU Chain Developer Certificate", issuer: "EDU Chain Developer Program", year: "2025", kind: "Certificate" },
      { icon: Certificate01Icon, title: "Ethereum Developer Certification", issuer: "Alchemy University", year: "2024", kind: "Certificate" },
      { icon: Certificate01Icon, title: "Greenfield Certificate", issuer: "HackQuest", year: "2024", kind: "Certificate" },
    ],
  },
  backend: {
    featured: {
      icon: PulseRectangle01Icon,
      figure: "99.99%",
      title: "Uptime on critical systems",
      issuer: "Production",
      detail: "Kept critical production systems available for more than a year straight.",
      year: "2023 – 2024",
      kind: "Milestone",
    },
    items: [
      { icon: Certificate01Icon, title: "GitHub Actions for CI/CD DevOps Pipelines", issuer: "Professional certification", year: "2023", kind: "Certificate" },
      { icon: Certificate01Icon, title: "Django for Everybody Specialization", issuer: "University of Michigan on Coursera", year: "2023", kind: "Certificate" },
      { icon: Certificate01Icon, title: "Automate with Python", issuer: "Udemy", year: "2024", kind: "Certificate" },
      { icon: Certificate01Icon, title: "Python Web Scraping and Automation with BS4 and Selenium", issuer: "Udemy", year: "2024", kind: "Certificate" },
      { icon: Certificate01Icon, title: "PyTorch Ultimate Bootcamp: Python Deep Learning", issuer: "Udemy", year: "2024", kind: "Certificate" },
    ],
  },
}

export function Achievements({ mode }: AchievementsProps) {
  const { featured, items } = recognition[mode]

  return (
    <Section
      id="recognition"
      label="Recognition"
      title={mode === "backend" ? "Proof beyond the code" : "Awards, roles, and certifications"}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Reveal className="min-w-0 lg:col-span-5">
          <article className="flex h-full flex-col rounded-2xl bg-card p-8">
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-xl bg-background ring-1 ring-border">
                <Icon icon={featured.icon} size={24} />
              </span>
              <span className="text-sm text-muted-foreground tabular-nums">{featured.year}</span>
            </div>
            <p className="text-hero mt-auto pt-16 text-6xl font-semibold tracking-tighter tabular-nums">{featured.figure}</p>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">{featured.title}</h3>
            <p className="mt-2 text-base text-muted-foreground">{featured.detail}</p>
          </article>
        </Reveal>

        <Reveal delay={80} className="min-w-0 lg:col-span-7">
          <ul className="h-full rounded-2xl p-2 ring-1 ring-border">
            {items.map((item) => (
              <li
                key={item.title}
                className="flex items-center gap-4 rounded-lg p-4 transition-colors duration-300 ease-soft hover:bg-card"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Icon icon={item.icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground sm:truncate">
                    {item.kind} · {item.issuer}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{item.year}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
