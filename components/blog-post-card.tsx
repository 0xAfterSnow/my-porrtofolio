import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { focusRing } from "@/lib/styles"

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  content: string
  category: string
  tags?: string[] | null
  cover_image?: string | null
  created_at: string
}

// Counts words in the text, not the HTML markup around it.
export function readingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export function formatDate(iso: string, month: "short" | "long" = "short") {
  return new Date(iso).toLocaleDateString("en-US", { month, day: "numeric", year: "numeric" })
}

const categoryLabel: Record<string, string> = { backend: "Backend", web3: "Web3", tips: "Tips" }
export const labelFor = (category: string) => categoryLabel[category] ?? category

export function PostMeta({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground", className)}>
      <span className="font-medium text-foreground">{labelFor(post.category)}</span>
      <span aria-hidden>·</span>
      <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
      <span aria-hidden>·</span>
      <span>{readingTime(post.content)} min read</span>
    </p>
  )
}

export function BlogPostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col gap-2 rounded-2xl bg-card p-2 transition-transform duration-500 ease-soft hover:-translate-y-1",
        featured && "md:grid md:grid-cols-5 md:gap-2",
        focusRing,
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/9] overflow-hidden rounded-lg bg-secondary",
          featured && "md:col-span-3 md:aspect-auto md:min-h-80",
        )}
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt=""
            fill
            sizes={featured ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex items-end p-4 text-4xl font-semibold tracking-tighter text-muted-foreground/40">
            {labelFor(post.category)}
          </span>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col p-4", featured && "md:col-span-2 md:p-6")}>
        <PostMeta post={post} />
        <h3
          className={cn(
            "mt-3 font-semibold tracking-tight",
            featured ? "text-2xl md:text-3xl" : "text-lg",
          )}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className={cn("mt-2 text-sm text-muted-foreground", featured ? "line-clamp-4 md:text-base" : "line-clamp-2")}>
            {post.excerpt}
          </p>
        )}
        {post.tags && post.tags.length > 0 && (
          <p className="mt-auto pt-6 text-xs text-muted-foreground">{post.tags.slice(0, 3).join(" · ")}</p>
        )}
      </div>
    </Link>
  )
}
