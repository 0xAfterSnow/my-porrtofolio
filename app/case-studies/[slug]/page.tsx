import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase/server"
import { renderRichText } from "@/lib/sanitize"
import {
  RICH_TEXT_FIELDS,
  isEmptyHtml,
  normalizeCaseStudy,
  readingTimeFor,
  type CaseStudy,
  type RichTextField,
} from "@/lib/case-study"
import { BlogNavbar } from "@/components/blog-navbar"
import { BlogFooter } from "@/components/blog-footer"
import { ReadingProgress } from "@/components/reading-progress"
import { CaseStudyArticle, type CaseStudyNeighbour } from "@/components/case-study/case-study-article"

export const revalidate = 3600 // Revalidate every hour

type Props = { params: Promise<{ slug: string }> }

async function getCaseStudy(slug: string) {
  const supabase = await createServerClient()
  const { data } = await supabase.from("case_studies").select("*").eq("slug", slug).eq("published", true).maybeSingle()
  return data ? normalizeCaseStudy(data) : null
}

function renderFields(study: CaseStudy) {
  return Object.fromEntries(
    RICH_TEXT_FIELDS.map((field) => [field, isEmptyHtml(study[field]) ? "" : renderRichText(study[field])]),
  ) as Record<RichTextField, string>
}

// Newest first, matching the homepage list.
async function getNeighbours(slug: string): Promise<{ prev: CaseStudyNeighbour; next: CaseStudyNeighbour }> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from("case_studies")
    .select("slug, title")
    .eq("published", true)
    .order("created_at", { ascending: false })
  const list = data ?? []
  const i = list.findIndex((s) => s.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return { prev: list[i - 1] ?? null, next: list[i + 1] ?? null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  // Thrown here, before streaming starts, so the response gets a real 404 status.
  if (!study) notFound()

  const images = study.image ? [{ url: study.image, alt: study.title }] : []
  return {
    title: `${study.title} | Case study`,
    description: study.description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      type: "article",
      title: study.title,
      description: study.description,
      url: `/case-studies/${study.slug}`,
      publishedTime: study.created_at,
      modifiedTime: study.updated_at ?? study.created_at,
      authors: ["Shagbaor Agber"],
      tags: study.tech,
      images,
    },
    twitter: {
      card: study.image ? "summary_large_image" : "summary",
      title: study.title,
      description: study.description,
      images: study.image ? [study.image] : [],
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) notFound()

  const { prev, next } = await getNeighbours(study.slug)
  const html = renderFields(study)
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://aftersnow.xyz").replace(/\/$/, "")
  const absolute = (url: string) => (url.startsWith("/") ? `${siteUrl}${url}` : url)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.description,
    image: study.image ? [absolute(study.image)] : undefined,
    datePublished: study.created_at,
    dateModified: study.updated_at ?? study.created_at,
    keywords: study.tech.join(", ") || undefined,
    author: { "@type": "Person", name: "Shagbaor Agber", url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/case-studies/${study.slug}` },
  }

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so content can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ReadingProgress />
      <BlogNavbar current="work" />
      <main id="main" className="px-6 pt-36">
        <CaseStudyArticle study={study} html={html} readingTime={readingTimeFor(study)} prev={prev} next={next} />
      </main>
      <BlogFooter />
    </>
  )
}
