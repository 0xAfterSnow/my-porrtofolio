import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import Script from "next/script"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { trackPageView } from "@/lib/analytics-server"
import { getSiteSettings } from "@/lib/get-settings"
import { cn } from "@/lib/utils"
import { focusRing } from "@/lib/styles"
import { Icon } from "@/components/icon"
import { BlogContent } from "@/components/blog-content"
import { BlogNavbar } from "@/components/blog-navbar"
import { BlogFooter } from "@/components/blog-footer"
import { AuthorCard } from "@/components/author-card"
import { ReadingProgress } from "@/components/reading-progress"
import { BlogPostCard, formatDate, labelFor, readingTime, type BlogPost } from "@/components/blog-post-card"

type Props = {
    params: Promise<{ slug: string }>
}

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = await createServerClient()
    const { slug } = await params
    const { data: post } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

    if (!post) {
        return {
            title: "Post Not Found",
        }
    }

    return {
        title: `${post.title} | Blog`,
        description: post.excerpt,
        keywords: post.tags || [],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.created_at,
            authors: ["Web3 + Backend Engineer"],
            images: post.cover_image ? [post.cover_image] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: post.cover_image ? [post.cover_image] : [],
        },
    }
}

export default async function BlogPostPage({ params }: Props) {
    const supabase = await createServerClient()
    const { slug } = await params
    const { data: post } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single()

    if (!post) {
        notFound()
    }

    await trackPageView("blog_post", post.id)


    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.cover_image ? [post.cover_image] : [],
        "datePublished": post.created_at,
        "author": [
            {
                "@type": "Person",
                "name": "Shagbaor Agber",
                "url": "https://aftersnow.xyz",
            },
        ],
    }

    const settings = await getSiteSettings()
    const minutes = readingTime(post.content)

    return (
        <>
            <Script
                id="blog-post-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ReadingProgress />
            <BlogNavbar />

            <main id="main" className="px-6 pt-36">
                <article>
                    <header className="mx-auto max-w-3xl">
                        <Link
                            href="/blog"
                            className={cn(
                                "-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition-colors duration-300 ease-soft hover:text-foreground",
                                focusRing,
                            )}
                        >
                            <Icon icon={ArrowLeft01Icon} size={16} />
                            All posts
                        </Link>

                        <p className="mt-10 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                            <Link
                                href={`/blog?category=${post.category}`}
                                className={cn("rounded font-medium text-foreground hover:underline", focusRing)}
                            >
                                {labelFor(post.category)}
                            </Link>
                            <span aria-hidden>·</span>
                            <time dateTime={post.created_at}>{formatDate(post.created_at, "long")}</time>
                            <span aria-hidden>·</span>
                            <span>{minutes} min read</span>
                        </p>

                        <h1 className="text-hero mt-4 pb-1 text-4xl font-semibold tracking-tighter md:text-6xl">
                            {post.title}
                        </h1>

                        {post.excerpt && <p className="mt-6 text-xl text-muted-foreground">{post.excerpt}</p>}

                        {post.tags && post.tags.length > 0 && (
                            <ul className="mt-8 flex flex-wrap gap-2">
                                {post.tags.map((tag: string) => (
                                    <li key={tag} className="rounded-md bg-card px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </header>

                    {post.cover_image && (
                        <div className="mx-auto mt-12 max-w-5xl rounded-2xl bg-card p-2">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                                <Image
                                    src={post.cover_image}
                                    alt=""
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 1024px"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mx-auto mt-16 max-w-3xl">
                        <BlogContent content={post.content} />
                    </div>
                </article>

                <div className="mx-auto mt-20 max-w-3xl">
                    <AuthorCard settings={settings} />
                </div>

                <RelatedPosts currentPostId={post.id} category={post.category} />
            </main>

            <BlogFooter />
        </>
    )
}

async function RelatedPosts({ currentPostId, category }: { currentPostId: string; category: string }) {
    const supabase = await createServerClient()
    const { data: posts } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .eq("category", category)
        .neq("id", currentPostId)
        .limit(3)

    if (!posts || posts.length === 0) return null

    return (
        <aside aria-labelledby="related-heading" className="mx-auto mt-24 max-w-6xl">
            <h2 id="related-heading" className="text-2xl font-semibold tracking-tight">
                Keep reading
            </h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
                {(posts as BlogPost[]).map((p) => (
                    <li key={p.id}>
                        <BlogPostCard post={p} />
                    </li>
                ))}
            </ul>
        </aside>
    )
}
