import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { focusRing } from "@/lib/styles"
import { Icon } from "@/components/icon"

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
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground", className)}>
      <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-foreground ring-1 ring-border">
        {labelFor(post.category)}
      </span>
      <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
    </p>
  )
}

function Cover({ post, featured }: { post: BlogPost; featured: boolean }) {
  if (post.cover_image) {
    return (
      <Image
        src={post.cover_image}
        alt=""
        fill
        sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
        className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
      />
    )
  }
  // No cover: a solid ink panel with the category set large.
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-foreground p-6 text-background">
      <span className="text-sm font-medium opacity-70">Notes</span>
      <span className="text-5xl font-semibold tracking-tighter">{labelFor(post.category)}</span>
    </div>
  )
}

export function BlogPostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-shadow duration-300 ease-soft hover:ring-foreground",
        featured && "md:grid md:grid-cols-2",
        focusRing,
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden border-b border-border bg-secondary",
          featured && "md:aspect-auto md:min-h-96 md:border-r md:border-b-0",
        )}
      >
        <Cover post={post} featured={featured} />
      </div>

      <div className={cn("flex flex-1 flex-col p-6", featured && "md:p-10")}>
        <PostMeta post={post} />
        <h3
          className={cn(
            "mt-4 font-semibold tracking-tight decoration-1 underline-offset-4 group-hover:underline",
            featured ? "text-3xl md:text-4xl" : "text-xl",
          )}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className={cn("mt-3 text-muted-foreground", featured ? "line-clamp-4 text-lg" : "line-clamp-2 text-base")}>
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-8">
          <span className="text-sm text-muted-foreground">{readingTime(post.content)} min read</span>
          <span className="flex size-9 items-center justify-center rounded-full ring-1 ring-border transition-[background-color,color,box-shadow] duration-300 ease-soft group-hover:bg-foreground group-hover:text-background group-hover:ring-foreground">
            <Icon
              icon={ArrowUpRight01Icon}
              size={16}
              className="transition-transform duration-500 ease-soft group-hover:rotate-45"
            />
          </span>
        </div>
      </div>
    </Link>
  )
}
