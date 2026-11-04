"use client"

import { useCallback, useState, type ReactNode } from "react"
import { RichText } from "@/components/case-study/rich-text"
import { ImageZoom, TableOfContents, useActiveSection, type TocItem, type ZoomImage } from "@/components/article-kit"

// Short posts read better as one centred column; the contents only earn their space on longer ones.
const MIN_HEADINGS_FOR_TOC = 3

interface BlogArticleBodyProps {
  // Server-rendered header (meta, title, excerpt, cover).
  header: ReactNode
  // Sanitized and decorated by renderArticle on the server.
  html: string
  headings: TocItem[]
  // Shown under the article, like the tags.
  after?: ReactNode
}

export function BlogArticleBody({ header, html, headings, after }: BlogArticleBodyProps) {
  const [zoom, setZoom] = useState<ZoomImage>(null)
  const openZoom = useCallback((image: { src: string; alt: string }) => setZoom(image), [])
  const showToc = headings.length >= MIN_HEADINGS_FOR_TOC
  const active = useActiveSection(showToc ? headings.map((h) => h.id) : [])

  const body = (
    <>
      <RichText html={html} onImageClick={openZoom} className="mt-16 prose-h2:mt-16 prose-h2:text-3xl" />
      {after}
    </>
  )

  return (
    <>
      {showToc ? (
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-9 lg:col-start-4 lg:max-w-3xl">{header}</div>
          <aside className="hidden pt-16 lg:col-span-3 lg:row-start-2 lg:block">
            <TableOfContents items={headings} active={active} />
          </aside>
          <div className="min-w-0 lg:col-span-9 lg:col-start-4 lg:row-start-2 lg:max-w-3xl">{body}</div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          {header}
          {body}
        </div>
      )}
      <ImageZoom image={zoom} onClose={() => setZoom(null)} />
    </>
  )
}
