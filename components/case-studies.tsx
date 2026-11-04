"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"
import { normalizeCaseStudy, readingTimeFor, type CaseStudy } from "@/lib/case-study"
import { Reveal, Section, focusRing } from "@/components/section"

interface CaseStudiesProps {
  mode: "backend" | "web3"
  // Published rows, fetched on the server with the rest of the page.
  studies: Record<string, any>[]
}

export function CaseStudies({ mode, studies }: CaseStudiesProps) {
  const caseStudies = useMemo(
    () => studies.map(normalizeCaseStudy).filter((s) => s.category === mode || s.category === "both"),
    [studies, mode],
  )

  // Nothing published for this mode: leave the section out rather than show an empty block.
  if (caseStudies.length === 0) return null

  return (
    <Section
      id="case-studies"
      label="Case studies"
      title="Problems worth writing up"
      description="The brief, how I approached it, and what I'd change next time"
    >
      <ul className="divide-y divide-border border-y border-border">
        {caseStudies.map((study) => {
          const meta = [study.context, study.timeframe, `${readingTimeFor(study)} min read`].filter(Boolean)
          return (
            <li key={study.id ?? study.slug}>
              <Reveal>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className={cn("group flex items-start justify-between gap-6 rounded-lg py-8", focusRing)}
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-xs text-muted-foreground">{meta.join(" · ")}</span>
                    <h3 className="mt-2 text-xl font-medium tracking-tight decoration-1 underline-offset-4 group-hover:underline md:text-2xl">
                      {study.title}
                    </h3>
                    <span className="mt-2 block max-w-[640px] text-base text-muted-foreground">
                      {study.subtitle || study.description}
                    </span>
                  </span>
                  <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-border transition-[background-color,color,box-shadow] duration-150 ease-soft group-hover:bg-foreground group-hover:text-background group-hover:ring-foreground">
                    <Icon
                      icon={ArrowUpRight01Icon}
                      size={16}
                      className="transition-transform duration-500 ease-soft group-hover:rotate-45"
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
