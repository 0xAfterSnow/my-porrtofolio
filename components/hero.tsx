"use client"

import { useState } from "react"
import {
  ArrowDown01Icon,
  BlockchainIcon,
  ChampionIcon,
  CodeIcon,
  GithubIcon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
  PulseRectangle01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"
import { ResumeModal } from "@/components/resume-modal"
import { Reveal, buttonPrimary, buttonQuiet, iconButton } from "@/components/section"

interface HeroProps {
  mode: "backend" | "web3"
}

const content = {
  backend: {
    role: "Backend engineer",
    roleIcon: CodeIcon,
    lines: ["Backend systems", "built to stay up"],
    intro:
      "I work in Python and Django, designing the APIs, data models, and infrastructure behind products that need to grow without falling over.",
    stats: [
      { value: "5+", label: "years shipping production backends" },
      { value: "5", label: "backend teams since 2019" },
      { value: "99.99%", label: "uptime held on critical systems" },
    ],
    file: "orders/views.py",
    code: [
      "class OrderViewSet(ModelViewSet):",
      "    queryset = Order.objects.select_related(",
      '        "customer"',
      "    )",
      "    serializer_class = OrderSerializer",
      "    permission_classes = [IsAuthenticated]",
      "",
      "    @method_decorator(cache_page(60))",
      "    def list(self, request, *args, **kw):",
      "        return super().list(request)",
    ],
    status: "Cached, authenticated, and indexed",
    proof: { icon: PulseRectangle01Icon, value: "99.99% uptime", label: "Critical systems, 2023 to 2024" },
  },
  web3: {
    role: "Smart contract developer",
    roleIcon: BlockchainIcon,
    lines: ["Smart contracts", "built to hold value"],
    intro:
      "I write, test, and audit Solidity for marketplaces, wagering protocols, and onchain ad networks across EVM chains and Algorand.",
    stats: [
      { value: "1st", label: "place at Algorand Global Hackathon" },
      { value: "6", label: "testnet contracts shipped for Secuda" },
      { value: "90%+", label: "test coverage on contract suites" },
    ],
    file: "contracts/Escrow.sol",
    code: [
      "function release(uint id) external nonReentrant {",
      "    Deal storage d = deals[id];",
      '    require(msg.sender == d.buyer, "Not buyer");',
      '    require(d.state == State.Funded, "Not funded");',
      "",
      "    d.state = State.Released;",
      "    _payout(d.seller, d.amount);",
      "}",
    ],
    status: "State updated before the external call",
    proof: { icon: ChampionIcon, value: "1st place", label: "Algorand Global Hackathon 2024" },
  },
}

const socials = [
  { href: "https://github.com/0xAfterSnow/", label: "GitHub", icon: GithubIcon },
  { href: "https://linkedin.com/in/shagbaoragber/", label: "LinkedIn", icon: Linkedin01Icon },
  { href: "https://x.com/0xAfterSnow", label: "X", icon: NewTwitterIcon },
  { href: "mailto:snow@aftersnow.xyz", label: "Email", icon: Mail01Icon },
]

const KEYWORDS =
  /\b(class|def|return|function|external|storage|require|uint256|bool|self|super|nonReentrant)\b/g

// Minimal monochrome highlighting: strings and keywords only.
function CodeLine({ line }: { line: string }) {
  const parts = line.split(/("[^"]*")/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('"') ? (
          <span key={i} className="text-muted-foreground">
            {part}
          </span>
        ) : (
          part.split(KEYWORDS).map((chunk, j) =>
            j % 2 === 1 ? (
              <span key={`${i}-${j}`} className="font-semibold text-foreground">
                {chunk}
              </span>
            ) : (
              <span key={`${i}-${j}`} className="text-foreground/75">
                {chunk}
              </span>
            ),
          )
        ),
      )}
    </>
  )
}

function CodeWindow({ mode }: HeroProps) {
  const copy = content[mode]
  return (
    <div className="relative min-w-0">
      <div className="rounded-2xl bg-card p-2 shadow-[0_24px_64px_-32px_rgb(0_0_0/0.35)] ring-1 ring-border">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="font-mono text-xs text-muted-foreground">{copy.file}</span>
          <span className="flex gap-1" aria-hidden>
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
          </span>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-xs leading-6">
          <code>
            {copy.code.map((line, i) => (
              <span key={i} className="code-line flex gap-4" style={{ animationDelay: `${300 + i * 60}ms` }}>
                <span className="w-4 shrink-0 text-right text-muted-foreground/50 select-none tabular-nums">
                  {i + 1}
                </span>
                <span className="whitespace-pre">
                  <CodeLine line={line} />
                </span>
              </span>
            ))}
          </code>
        </pre>
        <p className="flex items-center gap-2 px-3 pt-3 pb-2 text-xs text-muted-foreground">
          <Icon icon={Tick02Icon} size={14} className="text-emerald-500" />
          {copy.status}
        </p>
      </div>

      <div className="absolute -top-8 -right-4 hidden items-center gap-3 rounded-xl bg-background/80 p-2 pr-4 shadow-[0_16px_40px_-20px_rgb(0_0_0/0.4)] ring-1 ring-border backdrop-blur-xl sm:flex">
        <span className="flex size-10 items-center justify-center rounded-lg bg-secondary">
          <Icon icon={copy.proof.icon} size={20} />
        </span>
        <span>
          <span className="block text-sm font-semibold">{copy.proof.value}</span>
          <span className="block text-xs text-muted-foreground">{copy.proof.label}</span>
        </span>
      </div>
    </div>
  )
}

export function Hero({ mode }: HeroProps) {
  const [showResume, setShowResume] = useState(false)
  const copy = content[mode]

  return (
    <section id="top" className="flex min-h-[100dvh] items-center px-6 pt-32 pb-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <p className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon icon={copy.roleIcon} size={16} />
                Shagbaor Agber · {copy.role}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="text-hero max-w-[680px] pb-2 text-4xl font-semibold tracking-tighter sm:text-5xl md:text-6xl">
                {copy.lines[0]}
                <br />
                {copy.lines[1]}
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-[560px] text-lg text-muted-foreground">{copy.intro}</p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <a href="#projects" className={buttonPrimary}>
                  See selected work
                  <Icon icon={ArrowDown01Icon} size={16} />
                </a>
                <button type="button" onClick={() => setShowResume(true)} className={buttonQuiet}>
                  Read my resume
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="min-w-0 lg:col-span-5">
            <CodeWindow mode={mode} />
          </Reveal>
        </div>

        <Reveal delay={320}>
          <div className="mt-20 grid gap-8 border-t border-border pt-8 md:grid-cols-12">
            <dl className="grid grid-cols-3 gap-4 md:col-span-9">
              {copy.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight tabular-nums md:text-3xl">{stat.value}</dd>
                  <dd className="mt-1 max-w-[180px] text-xs text-muted-foreground md:text-sm">{stat.label}</dd>
                </div>
              ))}
            </dl>
            <ul className={cn("-ml-2 flex items-end gap-1 md:col-span-3 md:justify-end")}>
              {socials.map(({ href, label, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className={iconButton}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon icon={icon} size={20} />
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
