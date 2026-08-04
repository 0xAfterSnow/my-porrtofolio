import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { trackPageView } from "@/lib/analytics-server"
import { BlogContent } from "@/components/blog-content"
import { BlogNavbar } from "@/components/blog-navbar"
import Script from "next/script"
import { getSiteSettings } from "@/lib/get-settings"
import { AuthorCard } from "@/components/author-card"


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

    const readingTime = Math.ceil(post.content.split(" ").length / 200)

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

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Script
                id="blog-post-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <BlogNavbar />

            {/* Hero Section */}
            <header className="relative pt-12 pb-20 px-6 bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
                        <Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-1">
                            Blog
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium truncate">{post.title}</span>
                    </nav>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <Badge variant="secondary" className="uppercase tracking-wider font-bold text-[10px]">
                            {post.category}
                        </Badge>
                        {post.tags?.map((tag: string) => (
                            <span key={tag} className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                                <span className="opacity-50">#</span>{tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 text-balance tracking-tight leading-[1.1]">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-8 text-sm text-muted-foreground border-t border-border pt-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.created_at}>
                                {new Date(post.created_at).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </time>
                        </div>
                        <div className="flex items-center gap-2 border-l border-border pl-8">
                            <Clock className="h-4 w-4" />
                            <span>{readingTime} min read</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Cover Image */}
            {post.cover_image && (
                <section className="w-full max-w-7xl mx-auto px-6 py-12">
                    <div className="relative aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                        <Image
                            src={post.cover_image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            priority
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                    </div>
                </section>
            )}

            {/* Content */}
            <section className="max-w-4xl mx-auto px-6 py-16">
                <BlogContent content={post.content} />

                <div className="mt-16 border-t border-border pt-16">
                    <AuthorCard settings={await getSiteSettings()} />
                </div>
            </section>

            {/* Related Posts */}
            <aside className="max-w-4xl mx-auto px-6 py-16 border-t border-border">

                <h2 className="text-2xl font-bold mb-8 tracking-tight">Continue Reading</h2>
                <RelatedPosts currentPostId={post.id} category={post.category} />
            </aside>
        </main>
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
        <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                    <div className="group glass-card p-6 hover:border-primary transition-all duration-300">
                        <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
