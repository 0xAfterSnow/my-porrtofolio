"use client"

import { Certificate, GitBranch, Pulse, Trophy } from "@phosphor-icons/react"
import { Reveal, Section } from "@/components/section"

interface AchievementsProps {
  mode: "backend" | "web3"
}

const achievements = [
  {
    icon: Trophy,
    title: "Community Choice Award, Crypto Cities Hackathon",
    description: "Voted best project by the community",
    year: "2025",
    relevant: "web3",
  },
  {
    icon: GitBranch,
    title: "Maintainer, AmongFriends Protocol",
    description: "A protocol for peer to peer wagering without centralized control",
    year: "2025 – now",
    relevant: "web3",
  },
  {
    icon: Certificate,
    title: "EDU Chain Developer Certificate",
    description: "Completed the EDU Chain Developer Program",
    year: "2025",
    relevant: "web3",
  },
  {
    icon: Certificate,
    title: "Ethereum Developer Certification",
    description: "Alchemy University",
    year: "2024",
    relevant: "web3",
  },
  {
    icon: Certificate,
    title: "Greenfield Certificate, HackQuest",
    description: "Completed the Greenfield learner track",
    year: "2024",
    relevant: "web3",
  },
  {
    icon: Trophy,
    title: "Algorand Global Hackathon, 1st place",
    description: "Won with Secuda, a marketplace for smart insurance covers",
    year: "2024",
    relevant: "web3",
  },
  {
    icon: Certificate,
    title: "Automate with Python",
    description: "Udemy course completion",
    year: "2024",
    relevant: "backend",
  },
  {
    icon: Certificate,
    title: "Python Web Scraping and Automation with BS4 and Selenium",
    description: "Udemy course completion",
    year: "2024",
    relevant: "backend",
  },
  {
    icon: Certificate,
    title: "PyTorch Ultimate Bootcamp: Python Deep Learning",
    description: "Udemy course completion",
    year: "2024",
    relevant: "backend",
  },
  {
    icon: Certificate,
    title: "Django for Everybody Specialization",
    description: "University of Michigan on Coursera",
    year: "2023",
    relevant: "backend",
  },
  {
    icon: Pulse,
    title: "99.99% uptime on critical systems",
    description: "Held for more than a year in production",
    year: "2023 – 2024",
    relevant: "backend",
  },
  {
    icon: Certificate,
    title: "GitHub Actions for CI/CD DevOps Pipelines",
    description: "Professional level certification",
    year: "2023",
    relevant: "backend",
  },
]

export function Achievements({ mode }: AchievementsProps) {
  const filtered = achievements.filter((a) => a.relevant === mode)

  return (
    <Section id="recognition" label="Recognition" title="Awards, certifications, and milestones">
      <ul className="grid gap-x-8 md:grid-cols-2">
        {filtered.map(({ icon: Icon, title, description, year }, i) => (
          <li key={title}>
            <Reveal delay={(i % 2) * 80}>
              <div className="flex gap-4 border-b border-border py-6">
                <Icon size={20} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
                <p className="shrink-0 text-sm text-muted-foreground tabular-nums">{year}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
