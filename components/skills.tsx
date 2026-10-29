"use client"

import {
  ChartRelationshipIcon,
  ContractsIcon,
  Exchange01Icon,
  Hammer01Icon,
  HierarchyIcon,
  Image01Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons"
import { Icon, type IconType } from "@/components/icon"
import { Reveal, Section } from "@/components/section"

interface SkillsProps {
  mode: "backend" | "web3"
}

type Tool = { name: string; mark?: string; icon?: IconType; note?: string }
type Group = { label: string; tools: Tool[] }

const stacks: Record<SkillsProps["mode"], { core: Tool[]; groups: Group[] }> = {
  backend: {
    core: [
      { name: "Python", mark: "/brands/python.svg", note: "The language behind most of what I ship" },
      { name: "Django", mark: "/brands/django.svg", note: "APIs, admin tooling, and background jobs" },
      { name: "PostgreSQL", mark: "/brands/postgresql.svg", note: "Primary datastore, tuned query by query" },
    ],
    groups: [
      {
        label: "Frameworks and APIs",
        tools: [
          { name: "FastAPI", mark: "/brands/fastapi.svg" },
          { name: "GraphQL", mark: "/brands/graphql.svg" },
          { name: "Node.js", mark: "/brands/nodedotjs.svg" },
          { name: "Celery", mark: "/brands/celery.svg" },
        ],
      },
      {
        label: "Data and caching",
        tools: [
          { name: "Redis", mark: "/brands/redis.svg" },
          { name: "MongoDB", mark: "/brands/mongodb.svg" },
        ],
      },
      {
        label: "Infrastructure",
        tools: [
          { name: "Docker", mark: "/brands/docker.svg" },
          { name: "Kubernetes", mark: "/brands/kubernetes.svg" },
          { name: "AWS", mark: "/brands/amazonwebservices.svg" },
          { name: "System design", icon: HierarchyIcon },
        ],
      },
    ],
  },
  web3: {
    core: [
      { name: "Solidity", mark: "/brands/solidity.svg", note: "Contracts for marketplaces and protocols" },
      { name: "Hardhat", mark: "/icons/hardhat.svg", note: "Testing, scripting, and deployments" },
      { name: "Ethers.js", mark: "/brands/ethers.svg", note: "Wiring contracts into real apps" },
    ],
    groups: [
      {
        label: "Chains",
        tools: [
          { name: "Ethereum", mark: "/brands/ethereum.svg" },
          { name: "Algorand", mark: "/brands/algorand.svg" },
        ],
      },
      {
        label: "Tooling",
        tools: [
          { name: "Foundry", icon: Hammer01Icon },
          { name: "OpenZeppelin", mark: "/brands/openzeppelin.svg" },
          { name: "Chainlink", mark: "/brands/chainlink.svg" },
          { name: "The Graph", icon: ChartRelationshipIcon },
          { name: "Web3.js", mark: "/brands/web3dotjs.svg" },
          { name: "IPFS", mark: "/brands/ipfs.svg" },
        ],
      },
      {
        label: "Domains",
        tools: [
          { name: "DeFi", icon: Exchange01Icon },
          { name: "NFTs", icon: Image01Icon },
          { name: "Smart contracts", icon: ContractsIcon },
          { name: "Security reviews", icon: SecurityCheckIcon },
        ],
      },
    ],
  },
}

function Mark({ tool, size }: { tool: Tool; size: number }) {
  if (tool.mark) {
    return (
      <span
        aria-hidden
        className="brand-mark"
        style={{ width: size, height: size, ["--mark" as string]: `url(${tool.mark})` }}
      />
    )
  }
  return tool.icon ? <Icon icon={tool.icon} size={size} /> : null
}

export function Skills({ mode }: SkillsProps) {
  const { core, groups } = stacks[mode]

  return (
    <Section
      id="stack"
      label="Stack"
      title={mode === "backend" ? "The tools I reach for on the server" : "The tools I reach for onchain"}
      description={
        mode === "backend"
          ? "Three I use every day, and the rest I bring in when a project calls for them."
          : "Three I use on every contract, and the rest I bring in when a protocol calls for them."
      }
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {core.map((tool, i) => (
          <li key={tool.name}>
            <Reveal delay={i * 80} className="h-full">
              <div className="group h-full rounded-2xl bg-card p-6 ring-1 ring-border transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:ring-foreground/40">
                <span className="flex size-12 items-center justify-center rounded-xl bg-background text-foreground ring-1 ring-border">
                  <Mark tool={tool} size={24} />
                </span>
                <h3 className="mt-8 text-lg font-semibold tracking-tight">{tool.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tool.note}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-12 divide-y divide-border border-y border-border">
        {groups.map((group) => (
          <Reveal key={group.label}>
            <div className="grid gap-4 py-6 md:grid-cols-12 md:items-center md:gap-8">
              <h3 className="text-sm font-medium text-muted-foreground md:col-span-3">{group.label}</h3>
              <ul className="flex flex-wrap gap-2 md:col-span-9">
                {group.tools.map((tool) => (
                  <li
                    key={tool.name}
                    className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-medium text-foreground/90 ring-1 ring-border transition-colors duration-300 ease-soft hover:text-foreground hover:ring-foreground/30"
                  >
                    <Mark tool={tool} size={16} />
                    {tool.name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
