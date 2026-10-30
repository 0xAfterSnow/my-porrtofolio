import { cn } from "@/lib/utils"
import { Reveal, Section } from "@/components/section"

interface AboutProps {
  mode: "backend" | "web3"
}

const disciplines = [
  {
    key: "backend",
    title: "Backend engineering",
    body: "I build backend systems that handle millions of requests. From API design to database tuning, I care about reliability and performance at every layer.",
    stack: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Celery", "REST APIs"],
  },
  {
    key: "web3",
    title: "Web3 development",
    body: "I build decentralized applications, from smart contracts to multichain integrations, with security and the person using them in mind.",
    stack: ["Solidity", "Wagmi", "The Graph", "Ethers.js", "Hardhat", "IPFS", "OpenZeppelin", "Algorand", "EVM chains", "Web3.js"],
  },
] as const

export function About({ mode }: AboutProps) {
  return (
    <Section
      id="about"
      label="About"
      title="Backend reliability, applied to onchain products"
      description="With 5+ years building production systems, I bring the discipline of traditional backend engineering to Web3. I've worked with startups and established companies to ship systems that solve real problems."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {disciplines.map((d, i) => {
          const current = d.key === mode
          return (
            <Reveal key={d.key} delay={i * 80} className="h-full">
              <article
                className={cn(
                  "h-full rounded-2xl bg-card p-6 ring-1 ring-border transition-opacity duration-500 ease-soft md:p-8",
                  !current && "opacity-60 hover:opacity-100",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-tight">{d.title}</h3>
                  {current && (
                    <span className="rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background">
                      Viewing now
                    </span>
                  )}
                </div>
                <p className="mt-4 text-base text-muted-foreground">{d.body}</p>
                <p className="mt-6 text-sm">{d.stack.join(" · ")}</p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
