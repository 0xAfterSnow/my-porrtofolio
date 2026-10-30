"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { buttonPrimary, focusRing } from "@/lib/styles"
import { Icon } from "@/components/icon"
import { RichText } from "@/components/case-study/rich-text"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { SECTIONS, type CaseStudy, type RichTextField, type SectionId } from "@/lib/case-study"

export type CaseStudyNeighbour = { slug: string; title: string } | null

interface CaseStudyArticleProps {
  study: CaseStudy
  // Rich text fields, already sanitized and rendered on the server. Empty string means empty.
  html: Record<RichTextField, string>
  readingTime: number
  prev?: CaseStudyNeighbour
  next?: CaseStudyNeighbour
}

type ZoomImage = { src: string; alt: string } | null

const secondaryButton = cn(
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-base font-semibold ring-1 ring-border",
  "transition-[transform,background-color] duration-300 ease-soft hover:bg-secondary active:scale-[0.98]",
  focusRing,
)

function presentSections(study: CaseStudy, html: CaseStudyArticleProps["html"]) {
  const has: Record<SectionId, boolean> = {
    brief: Boolean(html.brief),
    approach: Boolean(html.approach),
    architecture: study.architecture.length > 0 || Boolean(html.architecture_notes),
    implementation: Boolean(html.implementation),
    results: Boolean(html.results),
    "honest-review": Boolean(html.honest_review),
    takeaways: Boolean(html.takeaways),
    links: study.links.length > 0,
  }
  return SECTIONS.filter((s) => has[s.id])
}

// Highlights the section whose heading most recently crossed the upper third of the screen.
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)
  const key = ids.join(",")
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-20% 0px -70% 0px" },
    )
    key.split(",").forEach((id) => {
      const el = id && document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [key])
  return active
}

function TableOfContents({ sections, active }: { sections: { id: string; title: string }[]; active: string | null }) {
  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="text-sm font-medium text-muted-foreground">On this page</p>
      <ol className="mt-4 space-y-1 border-l border-border">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1 pl-4 text-sm transition-colors duration-300 ease-soft",
                active === s.id
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
                focusRing,
              )}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function SectionBlock({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("scroll-mt-28 pt-16 first:pt-0", className)}>
      <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function CaseStudyArticle({ study, html, readingTime, prev, next }: CaseStudyArticleProps) {
  const [zoom, setZoom] = useState<ZoomImage>(null)
  const openZoom = useCallback((image: { src: string; alt: string }) => setZoom(image), [])

  const sections = presentSections(study, html)
  const active = useActiveSection(sections.map((s) => s.id))
  const title = (id: SectionId) => SECTIONS.find((s) => s.id === id)!.title
  const has = (id: SectionId) => sections.some((s) => s.id === id)
  const meta = [study.context, study.role, study.timeframe].filter(Boolean)

  return (
    <article>
      <header className="mx-auto max-w-6xl">
        <Link
          href="/#case-studies"
          className={cn(
            "-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition-colors duration-300 ease-soft hover:text-foreground",
            focusRing,
          )}
        >
          <Icon icon={ArrowLeft01Icon} size={16} />
          All case studies
        </Link>

        <div className="mt-10 max-w-3xl">
          {meta.length > 0 && (
            <p className="flex flex-wrap gap-x-2 text-sm text-muted-foreground">
              {meta.map((item, i) => (
                <span key={item} className="inline-flex gap-x-2">
                  {i > 0 && <span aria-hidden>·</span>}
                  {item}
                </span>
              ))}
            </p>
          )}
          <h1 className="text-hero mt-4 pb-1 text-4xl font-semibold tracking-tighter md:text-6xl">{study.title}</h1>
          {study.subtitle && <p className="mt-6 text-xl text-muted-foreground">{study.subtitle}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {study.tech.map((tag) => (
              <span key={tag} className="rounded-full px-3 py-1 text-sm font-medium ring-1 ring-border">
                {tag}
              </span>
            ))}
            <span className="text-sm text-muted-foreground sm:ml-2">{readingTime} min read</span>
          </div>
        </div>

        {study.image && (
          <div className="mt-12 rounded-2xl bg-card p-2 ring-1 ring-border">
            <button
              type="button"
              onClick={() => openZoom({ src: study.image, alt: study.title })}
              className={cn("block w-full cursor-zoom-in overflow-hidden rounded-lg", focusRing)}
              aria-label={`Enlarge cover image for ${study.title}`}
            >
              {/* Any host is allowed here, so a plain img instead of next/image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={study.image} alt="" className="aspect-[16/9] w-full object-cover" />
            </button>
          </div>
        )}
      </header>

      {study.metrics.length > 0 && (
        <div className="mx-auto mt-16 max-w-6xl">
          <h2 className="sr-only">Results in numbers</h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {study.metrics.map((metric, i) => (
              <div key={`${metric.label}-${i}`} className="flex flex-col-reverse rounded-2xl bg-card p-6 ring-1 ring-border">
                <dt className="mt-2 text-sm text-muted-foreground">{metric.label}</dt>
                <dd className="text-4xl font-semibold tracking-tight tabular-nums md:text-5xl">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {study.key_facts.length > 0 && (
        <div className="mx-auto mt-12 max-w-6xl">
          <h2 className="sr-only">Key facts</h2>
          <dl className="grid border-t border-border md:grid-cols-2 md:gap-x-12">
            {study.key_facts.map((fact, i) => (
              <div key={`${fact.label}-${i}`} className="flex gap-6 border-b border-border py-4">
                <dt className="w-2/5 shrink-0 text-sm text-muted-foreground">{fact.label}</dt>
                <dd className="min-w-0 text-sm font-medium break-words">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {sections.length > 0 && (
        <div className="mx-auto mt-20 grid max-w-6xl gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <TableOfContents sections={sections} active={active} />
          </aside>

          <div className="min-w-0 lg:col-span-9 lg:max-w-3xl">
            {has("brief") && (
              <SectionBlock id="brief" title={title("brief")}>
                <RichText html={html.brief} onImageClick={openZoom} />
              </SectionBlock>
            )}

            {has("approach") && (
              <SectionBlock id="approach" title={title("approach")}>
                <RichText html={html.approach} onImageClick={openZoom} />
              </SectionBlock>
            )}

            {has("architecture") && (
              <SectionBlock id="architecture" title={title("architecture")}>
                <div className="space-y-10">
                  {study.architecture.map((diagram, i) => (
                    <figure key={`${diagram.image_url}-${i}`}>
                      <button
                        type="button"
                        onClick={() => openZoom({ src: diagram.image_url, alt: diagram.alt })}
                        className={cn("block w-full cursor-zoom-in overflow-hidden rounded-xl ring-1 ring-border", focusRing)}
                        aria-label={`Enlarge diagram: ${diagram.alt}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={diagram.image_url} alt={diagram.alt} className="w-full bg-white object-contain" />
                      </button>
                      {diagram.caption && (
                        <figcaption className="mt-3 text-sm text-muted-foreground">{diagram.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
                {html.architecture_notes && (
                  <RichText html={html.architecture_notes} onImageClick={openZoom} className="mt-10" />
                )}
              </SectionBlock>
            )}

            {has("implementation") && (
              <SectionBlock id="implementation" title={title("implementation")}>
                <RichText html={html.implementation} onImageClick={openZoom} />
              </SectionBlock>
            )}

            {has("results") && (
              <SectionBlock id="results" title={title("results")}>
                <RichText html={html.results} onImageClick={openZoom} />
              </SectionBlock>
            )}

            {has("honest-review") && (
              <section
                id="honest-review"
                aria-labelledby="honest-review-heading"
                className="scroll-mt-28 pt-16 first:pt-0"
              >
                <div className="rounded-2xl bg-secondary/60 p-6 ring-1 ring-border md:p-8">
                  <p className="text-sm font-medium text-muted-foreground">Honest review</p>
                  <h2 id="honest-review-heading" className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                    {title("honest-review")}
                  </h2>
                  <RichText html={html.honest_review} onImageClick={openZoom} className="mt-6" />
                </div>
              </section>
            )}

            {has("takeaways") && (
              <SectionBlock id="takeaways" title={title("takeaways")}>
                <RichText html={html.takeaways} onImageClick={openZoom} />
              </SectionBlock>
            )}

            {has("links") && (
              <SectionBlock id="links" title={title("links")}>
                <ul className="flex flex-wrap gap-2">
                  {study.links.map((link, i) => (
                    <li key={`${link.url}-${i}`}>
                      <a
                        href={link.url}
                        target={link.url.startsWith("/") ? undefined : "_blank"}
                        rel={link.url.startsWith("/") ? undefined : "noopener noreferrer"}
                        className={i === 0 ? buttonPrimary : secondaryButton}
                      >
                        {link.label}
                        <Icon icon={ArrowUpRight01Icon} size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            )}
          </div>
        </div>
      )}

      {(prev || next) && (
        <nav aria-label="More case studies" className="mx-auto mt-24 grid max-w-6xl gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/case-studies/${prev.slug}`}
              className={cn(
                "group rounded-2xl bg-card p-6 ring-1 ring-border transition-shadow duration-300 ease-soft hover:ring-foreground",
                focusRing,
              )}
            >
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Icon icon={ArrowLeft01Icon} size={16} />
                Previous case study
              </span>
              <span className="mt-2 block text-lg font-semibold tracking-tight">{prev.title}</span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/case-studies/${next.slug}`}
              className={cn(
                "group rounded-2xl bg-card p-6 text-right ring-1 ring-border transition-shadow duration-300 ease-soft hover:ring-foreground",
                focusRing,
              )}
            >
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                Next case study
                <Icon icon={ArrowRight01Icon} size={16} />
              </span>
              <span className="mt-2 block text-lg font-semibold tracking-tight">{next.title}</span>
            </Link>
          )}
        </nav>
      )}

      <Dialog open={zoom !== null} onOpenChange={(open) => !open && setZoom(null)}>
        <DialogContent className="max-w-[95vw] border-0 bg-transparent p-0 shadow-none sm:max-w-[95vw]">
          <DialogTitle className="sr-only">{zoom?.alt || "Enlarged image"}</DialogTitle>
          {zoom && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={zoom.src} alt={zoom.alt} className="max-h-[85dvh] w-full rounded-xl bg-white object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </article>
  )
}
