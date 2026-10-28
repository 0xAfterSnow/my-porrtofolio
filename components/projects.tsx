"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowUpRight01Icon, GithubIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"
import { Reveal, Section, buttonQuiet, iconButton } from "@/components/section"

interface ProjectsProps {
  mode: "backend" | "web3"
  projects: any[]
}

const PREVIEW_COUNT = 5

function ProjectCard({ project, featured }: { project: any; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-2 rounded-2xl bg-card p-2",
        featured && "md:grid md:grid-cols-5 md:gap-2",
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-lg bg-secondary",
          featured && "md:col-span-3 md:aspect-auto md:min-h-80",
        )}
      >
        <Image
          src={project.image || "/placeholder.svg"}
          alt={`Screenshot of ${project.title}`}
          fill
          sizes={featured ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]"
        />
      </div>

      <div className={cn("flex flex-1 flex-col p-4", featured && "md:col-span-2 md:p-6")}>
        <div className="flex items-start justify-between gap-4">
          <h3 className={cn("text-lg font-semibold tracking-tight", featured && "md:text-2xl")}>{project.title}</h3>
          <div className="-mt-2 -mr-2 flex shrink-0">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Source code for ${project.title}`}
                className={iconButton}
              >
                <Icon icon={GithubIcon} />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live version of ${project.title}`}
                className={iconButton}
              >
                <Icon icon={ArrowUpRight01Icon} />
              </a>
            )}
          </div>
        </div>

        <p className={cn("mt-2 text-sm text-muted-foreground", featured ? "line-clamp-6" : "line-clamp-3")}>
          {project.description}
        </p>

        {project.impact && <p className="mt-4 text-sm font-medium">{project.impact}</p>}

        {project.tech?.length > 0 && (
          <p className="mt-auto pt-6 text-xs text-muted-foreground">{project.tech.join(" · ")}</p>
        )}
      </div>
    </article>
  )
}

export function Projects({ mode, projects }: ProjectsProps) {
  const [showAll, setShowAll] = useState(false)
  const filtered = projects.filter((project) => project.category === mode || project.category === "both")
  const visible = showAll ? filtered : filtered.slice(0, PREVIEW_COUNT)

  return (
    <Section
      id="projects"
      label="Selected work"
      title={mode === "backend" ? "Backends I've designed and shipped" : "Contracts and dapps I've shipped"}
      description="What each project does and what it changed. Source and live links sit on each card where they exist."
    >
      {filtered.length === 0 ? (
        <Reveal>
          <div className="rounded-2xl bg-card p-8 md:p-12">
            <h3 className="text-xl font-semibold">Write ups are on the way</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              I'm still documenting these projects. In the meantime, most of the code is public on GitHub.
            </p>
            <a
              href="https://github.com/0xAfterSnow/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonQuiet, "-ml-3 mt-6")}
            >
              Browse my GitHub
              <Icon icon={ArrowUpRight01Icon} size={16} />
            </a>
          </div>
        </Reveal>
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {visible.map((project, i) => (
              <li key={project.id} className={cn(i === 0 && "md:col-span-2")}>
                <Reveal delay={i === 0 ? 0 : (i % 2) * 80} className="h-full">
                  <ProjectCard project={project} featured={i === 0} />
                </Reveal>
              </li>
            ))}
          </ul>

          {filtered.length > PREVIEW_COUNT && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
                className={buttonQuiet}
              >
                {showAll ? "Show fewer projects" : `Show all ${filtered.length} projects`}
              </button>
            </div>
          )}
        </>
      )}
    </Section>
  )
}
