"use client"

import Image from "next/image"
import { Reveal, Section } from "@/components/section"

interface SkillsProps {
  mode: "backend" | "web3"
}

type Skill = { name: string; icon?: string }

const backendSkills: Skill[] = [
  { name: "Python", icon: "/icons/python.svg" },
  { name: "Django", icon: "/icons/django.svg" },
  { name: "FastAPI", icon: "/icons/fastapi.svg" },
  { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
  { name: "Redis", icon: "/icons/redis.svg" },
  { name: "Docker", icon: "/icons/docker.svg" },
  { name: "AWS", icon: "/icons/aws.svg" },
  { name: "GraphQL", icon: "/icons/graphql.svg" },
  { name: "Node.js" },
  { name: "MongoDB" },
  { name: "Kubernetes" },
  { name: "System design" },
]

const web3Skills: Skill[] = [
  { name: "Solidity", icon: "/icons/solidity.svg" },
  { name: "Ethereum", icon: "/icons/ethereum.svg" },
  { name: "Web3.js", icon: "/icons/web3js.svg" },
  { name: "Hardhat", icon: "/icons/hardhat.svg" },
  { name: "IPFS", icon: "/icons/ipfs-dark.svg" },
  { name: "Smart contracts", icon: "/icons/file-type-solidity.svg" },
  { name: "DeFi", icon: "/icons/defi.svg" },
  { name: "NFTs", icon: "/icons/nfts.svg" },
  { name: "Ethers.js" },
  { name: "Chainlink" },
  { name: "The Graph" },
  { name: "Foundry" },
]

export function Skills({ mode }: SkillsProps) {
  const skills = mode === "backend" ? backendSkills : web3Skills

  return (
    <Section
      id="stack"
      label="Stack"
      title={mode === "backend" ? "The tools I reach for on the server" : "The tools I reach for onchain"}
      description={
        mode === "backend"
          ? "Python and Django first, with Postgres and Redis underneath and Docker on the way out."
          : "Solidity first, tested in Hardhat and Foundry, wired to frontends with Ethers.js."
      }
    >
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {skills.map((skill, i) => (
          <li key={skill.name}>
            <Reveal delay={Math.min(i * 40, 400)}>
              <div className="flex items-center gap-3 rounded-2xl bg-card p-2 pr-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-border">
                  {skill.icon ? (
                    <Image src={skill.icon} alt="" width={24} height={24} className="size-6 object-contain" />
                  ) : (
                    <span className="text-sm font-semibold text-neutral-900">{skill.name.charAt(0)}</span>
                  )}
                </span>
                <span className="truncate text-sm font-medium">{skill.name}</span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
