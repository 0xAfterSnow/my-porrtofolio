"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { CaseStudies } from "@/components/case-studies"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { SiteNav } from "@/components/site-nav"
import { Skills } from "@/components/skills"
import { Tagline } from "@/components/tagline"
import { WorkExperience } from "@/components/work-experience"
import { Testimonials } from "@/components/testimonials"
import { Achievements } from "@/components/achievements"
import type { Contributions } from "@/lib/github"

interface HomeClientProps {
    initialProjects: any[]
    avatarUrl?: string | null
    contributions: Contributions | null
}

export function HomeClient({ initialProjects, avatarUrl, contributions }: HomeClientProps) {
    const [mode, setMode] = useState<"backend" | "web3">("backend")
    const [fading, setFading] = useState(false)

    // Fade the page out, swap content, then fade back in.
    const handleModeChange = (newMode: "backend" | "web3") => {
        if (newMode === mode || fading) return
        setFading(true)
        setTimeout(() => {
            setMode(newMode)
            requestAnimationFrame(() => setFading(false))
        }, 300)
    }

    return (
        <>
            <SiteNav mode={mode} onModeChange={handleModeChange} />
            <main
                id="main"
                className={`transition-opacity duration-300 ease-soft ${fading ? "opacity-0" : "opacity-100"}`}
            >
                <Hero mode={mode} avatarUrl={avatarUrl} />
                <Skills mode={mode} />
                <Projects mode={mode} projects={initialProjects} />
                <Tagline mode={mode} />
                <WorkExperience mode={mode} />
                <Achievements mode={mode} />
                <CaseStudies mode={mode} />
                <Testimonials mode={mode} />
                <About mode={mode} />
                <Contact mode={mode} contributions={contributions} />
            </main>
        </>
    )
}
