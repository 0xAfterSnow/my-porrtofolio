"use client"

import { useEffect, useRef } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-python"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-solidity"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/components/prism-sql"

export function BlogContent({ content }: { content: string }) {
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (contentRef.current) {
            Prism.highlightAllUnder(contentRef.current)
        }
    }, [content])

    return (
        <div
            ref={contentRef}
            className="prose prose-lg max-w-none dark:prose-invert
        prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight
        prose-h2:mt-16 prose-h2:text-3xl prose-h3:mt-10 prose-h3:text-2xl
        prose-p:text-foreground/80 prose-li:text-foreground/80 prose-li:marker:text-muted-foreground
        prose-a:font-medium prose-a:text-foreground prose-a:underline prose-a:decoration-border prose-a:underline-offset-4 hover:prose-a:decoration-foreground
        prose-strong:font-semibold prose-strong:text-foreground
        prose-code:rounded-md prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.875em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
        prose-pre:rounded-xl prose-pre:bg-card prose-pre:ring-1 prose-pre:ring-border
        prose-blockquote:border-l-2 prose-blockquote:border-foreground prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-foreground
        prose-img:rounded-xl prose-hr:border-border
        prose-table:text-base prose-th:text-foreground"
            // Prism highlights code blocks on page load, before hydration, so the markup differs on purpose.
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: content }}
        />
    )
}
