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
      {/* The discipline being viewed leads and gets the wider column. */}
      <Reveal>
        <div className="grid divide-y divide-border rounded-2xl bg-card ring-1 ring-border md:grid-cols-5 md:divide-x md:divide-y-0">
          {[...disciplines]
            .sort((a, b) => Number(b.key === mode) - Number(a.key === mode))
            .map((d) => {
              const current = d.key === mode
              return (
                <article key={d.key} className={cn("p-6 md:p-8", current ? "md:col-span-3" : "md:col-span-2")}>
                  <h3 className={cn("font-medium tracking-tight", current ? "text-2xl" : "text-lg text-muted-foreground")}>
                    {d.title}
                  </h3>
                  <p className={cn("mt-4 text-muted-foreground", current ? "text-base" : "text-sm")}>{d.body}</p>
                  <p className={cn("mt-6 font-mono text-xs", current ? "text-foreground" : "text-muted-foreground")}>
                    {d.stack.join(" · ")}
                  </p>
                </article>
              )
            })}
        </div>
      </Reveal>
    </Section>
  )
}
