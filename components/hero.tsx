"use client"

import { useState } from "react"
import { ArrowDown, EnvelopeSimple, GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react"
import { ResumeModal } from "@/components/resume-modal"
import { Reveal, buttonPrimary, buttonQuiet, iconButton } from "@/components/section"

interface HeroProps {
  mode: "backend" | "web3"
}

const content = {
  backend: {
    role: "Backend engineer",
    lines: ["Backend systems", "built to stay up"],
    intro:
      "I work in Python and Django, designing the APIs, data models, and infrastructure behind products that need to grow without falling over.",
    proof: ["5+ years shipping production backends", "Senior backend developer at Asterverse"],
  },
  web3: {
    role: "Smart contract developer",
    lines: ["Smart contracts", "built to hold value"],
    intro:
      "I write, test, and audit Solidity for marketplaces, wagering protocols, and onchain ad networks across EVM chains and Algorand.",
    proof: ["1st place, Algorand Global Hackathon 2024", "Maintainer of AmongFriends Protocol"],
  },
}

const socials = [
  { href: "https://github.com/0xAfterSnow/", label: "GitHub", Icon: GithubLogo },
  { href: "https://linkedin.com/in/shagbaoragber/", label: "LinkedIn", Icon: LinkedinLogo },
  { href: "https://x.com/0xAfterSnow", label: "X", Icon: XLogo },
  { href: "mailto:snow@aftersnow.xyz", label: "Email", Icon: EnvelopeSimple },
]

export function Hero({ mode }: HeroProps) {
  const [showResume, setShowResume] = useState(false)
  const copy = content[mode]

  return (
    <section id="top" className="flex min-h-[100dvh] items-center px-6 pt-32 pb-20">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-8 text-sm font-medium text-muted-foreground">Shagbaor Agber · {copy.role}</p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-hero max-w-[680px] pb-2 text-5xl font-semibold tracking-tighter md:text-6xl">
            {copy.lines[0]}
            <br />
            {copy.lines[1]}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 max-w-[680px] text-lg text-muted-foreground md:text-xl">{copy.intro}</p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <a href="#projects" className={buttonPrimary}>
              See selected work
              <ArrowDown size={16} weight="bold" />
            </a>
            <button type="button" onClick={() => setShowResume(true)} className={buttonQuiet}>
              Read my resume
            </button>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-16 flex flex-col gap-6 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
              {copy.proof.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="-ml-2 flex items-center gap-1">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className={iconButton}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <ResumeModal open={showResume} onOpenChange={setShowResume} mode={mode} />
    </section>
  )
}
