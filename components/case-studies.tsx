"use client"

import { useState, useEffect } from "react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Reveal, Section, focusRing } from "@/components/section"

interface CaseStudiesProps {
  mode: "backend" | "web3"
}

type CaseStudy = {
  id: string
  title: string
  category: string
  challenge: string
  solution: string
  results: string
  metrics: Record<string, any>
}

function CaseStudySkeleton() {
  return (
    <div className="divide-y divide-border border-y border-border" aria-busy="true" aria-label="Loading case studies">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center justify-between py-8">
          <div className="h-6 w-2/3 animate-pulse rounded-md bg-secondary md:w-1/2" />
          <div className="size-6 animate-pulse rounded-full bg-secondary" />
        </div>
      ))}
    </div>
  )
}

export function CaseStudies({ mode }: CaseStudiesProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCaseStudies = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("case_studies")
        .select("*")
        .eq("published", true)
        .or(`category.eq.${mode},category.eq.both`)
        .order("created_at", { ascending: false })

      if (data) {
        setCaseStudies(data)
      }
      setLoading(false)
    }

    fetchCaseStudies()
  }, [mode])

  // Nothing published for this mode: leave the section out rather than show an empty block.
  if (!loading && caseStudies.length === 0) return null

  return (
    <Section
      id="case-studies"
      label="Case studies"
      title="Problems worth writing up"
      description="The challenge, what I built, and what changed afterwards."
    >
      {loading ? (
        <CaseStudySkeleton />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {caseStudies.map((study) => {
            const open = openId === study.id
            return (
              <li key={study.id}>
                <Reveal>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : study.id)}
                      aria-expanded={open}
                      aria-controls={`case-${study.id}`}
                      className={cn(
                        "group flex w-full items-center justify-between gap-6 rounded-lg py-8 text-left",
                        focusRing,
                      )}
                    >
                      <span className="text-xl font-semibold tracking-tight md:text-2xl">{study.title}</span>
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary transition-colors duration-300 ease-soft group-hover:bg-accent">
                        <Icon
                          icon={PlusSignIcon}
                          size={16}
                          className={cn("transition-transform duration-500 ease-soft", open && "rotate-45")}
                        />
                      </span>
                    </button>
                  </h3>

                  {open && (
                    <div id={`case-${study.id}`} className="expand-in pb-10">
                      <div className="grid gap-8 md:grid-cols-3">
                        {[
                          { label: "Challenge", text: study.challenge },
                          { label: "Solution", text: study.solution },
                          { label: "Results", text: study.results },
                        ].map(({ label, text }) => (
                          <div key={label}>
                            <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
                            <p className="mt-2 text-base">{text}</p>
                          </div>
                        ))}
                      </div>

                      {study.metrics && Object.keys(study.metrics).length > 0 && (
                        <ul className="mt-8 flex flex-wrap gap-2">
                          {Object.entries(study.metrics).map(([key, value]) => (
                            <li key={key} className="rounded-lg bg-card px-3 py-2 text-sm font-semibold tabular-nums">
                              {value as string}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </Reveal>
              </li>
            )
          })}
        </ul>
      )}
    </Section>
  )
}
