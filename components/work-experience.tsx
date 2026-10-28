"use client"

import { useState } from "react"
import { Minus, Plus } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Reveal, Section, focusRing } from "@/components/section"

interface WorkExperienceProps {
  mode: "backend" | "web3"
}

type Experience = (typeof experiences)[number]

const experiences = [
  {
    title: "Senior Backend Developer",
    company: "Asterverse",
    location: "Remote",
    period: "03/2025 – Present",
    type: "backend",
    description:
      "Company focused on software development",
    achievements: [
      "Architected, developed, and maintained scalable backend systems powering multiple production applications using Python, Django, and Django REST Framework",
      "Led the design and implementation of high-performance RESTful APIs, enabling seamless integration across internal services and third party platforms",
      "Optimized application performance through database tuning, caching strategies, and efficient query design, improving system responsiveness under increasing workloads",
      "Designed scalable backend architectures and reusable service components to accelerate feature delivery across multiple products",
      "Strengthened platform reliability by implementing robust authentication, validation, logging, monitoring, and error handling practices throughout backend services",
    ],
  },
  {
    title: "Senior Backend Developer",
    company: "Claadme",
    location: "Nigeria",
    period: "08/2024 – 11/2024",
    type: "backend",
    description:
      "Company focused on social media platform development",
    achievements: [
      "Played a pivotal role in building and optimizing APIs for a social media platform",
      "Enhanced performance and reliability of backend services to support a seamless user experience",
      "Collaborated with frontend teams to ensure APIs met evolving user needs",
      "Developed a RESTful API that improved scalability and reduced latency",
      "Created a custom UI library that significantly increased developer productivity",
      "Implemented CI/CD pipelines to streamline deployment processes",
      "Mentored junior developers and conducted code reviews to ensure high code quality",
      "Committed to writing clean, modular code"
    ],
  },
  {
    title: "Backend Developer",
    company: "Mediconnect System Services",
    location: "Nigeria",
    period: "06/2023 – 04/2024",
    type: "backend",
    description:
      "Company specializing in medical technology services. Led backend development for scalable web apps.",
    achievements: [
      "Enhanced application performance and user experience",
      "Developed a RESTful API that improved scalability and reduced latency",
      "Created a custom UI library that significantly increased developer productivity",
      "Refactored legacy code and optimized database queries",
      "Implemented CI/CD pipelines to streamline deployment processes",
      "Mentored junior developers and conducted code reviews to ensure high code quality",
      "Committed to writing clean, modular code"
    ],
  },
  {
    title: "WordPress Developer",
    company: "Better Life Nija",
    location: "Nigeria",
    period: "06/2022 – 12/2022",
    type: "backend",
    description:
      "A company focused on creating impactful WordPress sites and web applications. Led backend development for scalable web apps.",
    achievements: [
      "Developed and maintained WordPress websites ensuring they were fast, secure, and user friendly",
      "Created custom themes and plugins to enhance functionality",
      "Collaborated with designers and project managers to meet project timelines",
      "Optimized website performance and SEO",
      "Provided training and support to clients for managing their WordPress sites",
      "Committed to writing clean, modular code"
    ],
  },
  {
    title: "Smart Contract Developer",
    company: "AdChain",
    location: "Remote",
    period: "2025 – 2026",
    type: "web3",
    description:
      "AdChain is a global marketplace for ad inventory and data, built on an open protocol that connects advertisers and publishers directly. It empowers advertisers to campaign transparently and publishers to maximize yields with full control over their inventory and revenue streams.",
    achievements: [
      "Built an open protocol for global ad marketplace connecting advertisers and publishers.",
      "Empowered advertisers with transparent campaign management and publishers with maximized revenue through direct inventory control.",
      "Implemented blockchain based ad tracking to reduce fraud and increase trust in digital advertising ecosystem.",
      "Developed smart contracts to automate ad buying and selling, ensuring secure and transparent transactions.",
      "Created a decentralized identity system for advertisers and publishers to maintain control over their data and reputation.",
      "Built a comprehensive analytics dashboard to provide real time insights into campaign performance and ad inventory metrics.",
      "Collaborated with industry partners to integrate AdChain protocol with existing advertising platforms, expanding market reach.",
      "Optimized smart contracts to reduce gas costs and improve transaction speed, ensuring efficient and cost effective operations.",
      "Implemented a comprehensive test suite with over 90% test coverage to ensure smart contract security and reliability.",
      "Conducted security audits and vulnerability assessments to identify and mitigate potential risks in smart contracts.",
    ],
  },
  {
    title: "Backend Developer",
    company: "Ceto Data Works",
    location: "Nigeria",
    period: "10/2019 – 10/2021",
    type: "backend",
    description: "Company specializing in data solutions",
    achievements: [
      "Developed robust backend applications with Django focusing on security and scalability",
      "Analyzed user needs and integrated external APIs",
      "Designed efficient database models",
      "Collaborated with frontend developers to enhance user experience",
      "Optimized application performance and scalability",
      "Ensured high code quality through automated testing and code reviews"
    ],
  },
  {
    title: "Blockchain Developer",
    company: "Secuda",
    location: "Remote",
    period: "2024 – 2025",
    type: "web3",
    description: "Secuda is a blockchain based solution to address inefficiencies in the secondary market for smart insurance contracts. Created a p2p marketplace for users to trade contract covers with confidence.",
    achievements: [
      "Built and deployed 6 smart contracts (on Testnet) to handle digital document ownership, storage, and management.",
      "Integrated IPFS with blockchain to create a robust decentralized file storage system, ensuring data immutability and accessibility.",
      "Developed and implemented a Proof-of-Storage (PoS) consensus mechanism to verify data integrity and prevent data tampering.",
      "Implemented a secure wallet based authentication system that provides users with full control over their private keys and documents.",
      "Built and deployed a peer to peer (P2P) marketplace for document trading and sharing, leveraging smart contracts to facilitate secure transactions.",
      "Optimized smart contracts to reduce gas costs and improve transaction speed, ensuring efficient and cost effective operations.",
      "Implemented a comprehensive test suite with over 90% test coverage to ensure smart contract security and reliability.",
      "Conducted security audits and vulnerability assessments to identify and mitigate potential risks in smart contracts.",
    ],
  },
]

const VISIBLE_POINTS = 3

function ExperienceItem({ exp }: { exp: Experience }) {
  const [expanded, setExpanded] = useState(false)
  const points = expanded ? exp.achievements : exp.achievements.slice(0, VISIBLE_POINTS)
  const hidden = exp.achievements.length - VISIBLE_POINTS

  return (
    <article className="grid gap-4 py-10 md:grid-cols-12 md:gap-8">
      <div className="text-sm text-muted-foreground tabular-nums md:col-span-3">
        <p>{exp.period}</p>
        <p>{exp.location}</p>
      </div>
      <div className="max-w-[680px] md:col-span-9">
        <h3 className="text-xl font-semibold tracking-tight">{exp.title}</h3>
        <p className="mt-1 text-base text-muted-foreground">{exp.company}</p>
        <p className="mt-4 text-base">{exp.description}</p>
        <ul className="mt-4 space-y-2">
          {points.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={cn(
              "mt-4 -ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold transition-colors duration-300 ease-soft hover:bg-secondary",
              focusRing,
            )}
          >
            {expanded ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
            {expanded ? "Show less" : `${hidden} more highlights`}
          </button>
        )}
      </div>
    </article>
  )
}

export function WorkExperience({ mode }: WorkExperienceProps) {
  const filtered = experiences.filter((exp) => exp.type === mode)

  return (
    <Section
      id="experience"
      label="Experience"
      title={mode === "backend" ? "Where I've built backends" : "Where I've shipped onchain"}
      description={
        mode === "backend"
          ? "Five teams since 2019, from data services to healthcare and social platforms."
          : "Protocols and marketplaces where the contracts carry real value."
      }
    >
      <ol className="divide-y divide-border border-y border-border">
        {filtered.map((exp) => (
          <li key={exp.company}>
            <Reveal>
              <ExperienceItem exp={exp} />
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
