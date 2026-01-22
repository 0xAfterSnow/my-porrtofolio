import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { trackPageView } from "@/lib/analytics-server"
import { BlogNavbar } from "@/components/blog-navbar"

export const metadata: Metadata = {
    title: "Developer Blog | Shagbaor Agber",
    description: "Insights on Backend Engineering, Web3 Architecture, and Full-Stack Development by Shagbaor Agber.",
    openGraph: {
        title: "Developer Blog | Shagbaor Agber",
        description: "Technical articles and tutorials about backend engineering and decentralized technologies.",
        type: "website",
        url: "https://shagbaor.dev/blog",
    },
    twitter: {
        card: "summary_large_image",
        title: "Developer Blog | Shagbaor Agber",
        description: "Technical insights and tutorials by Shagbaor Agber.",
    },
    alternates: {
        canonical: "/blog",
    },
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const supabase = await createServerClient()
    const { category } = await searchParams

    let query = supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false })

    if (category && category !== "all") {
        query = query.eq("category", category)
    }

    const { data: posts } = await query

    await trackPageView("blog")

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <BlogNavbar />

            <section className="flex-1 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Developer Blog</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Technical articles, deep dives, and insights on backend engineering and Web3 development.
                        </p>
                    </header>

                    {/* Category Filter */}
                    <nav className="flex flex-wrap justify-center gap-4 mb-12" aria-label="Blog categories">
                        <Link href="/blog">
                            <Badge
                                variant={!category || category === "all" ? "default" : "outline"}
                                className="cursor-pointer px-6 py-2 text-sm transition-all hover:scale-105"
                            >
                                All Posts
                            </Badge>
                        </Link>
                        <Link href="/blog?category=backend">
                            <Badge
                                variant={category === "backend" ? "default" : "outline"}
                                className="cursor-pointer px-6 py-2 text-sm transition-all hover:scale-105"
                            >
                                Backend
                            </Badge>
                        </Link>
                        <Link href="/blog?category=web3">
                            <Badge
                                variant={category === "web3" ? "default" : "outline"}
                                className="cursor-pointer px-6 py-2 text-sm transition-all hover:scale-105"
                            >
                                Web3
                            </Badge>
                        </Link>
                        <Link href="/blog?category=both">
                            <Badge
                                variant={category === "both" ? "default" : "outline"}
                                className="cursor-pointer px-6 py-2 text-sm transition-all hover:scale-105"
                            >
                                Architecture
                            </Badge>
                        </Link>
                    </nav>

                    {/* Blog Posts Grid */}
                    {posts && posts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article key={post.id} className="h-full">
                                    <Link href={`/blog/${post.slug}`}>
                                        <Card className="group glass-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full">
                                            {post.cover_image && (
                                                <div className="relative overflow-hidden rounded-t-lg h-56">
                                                    <img
                                                        src={post.cover_image || "/placeholder.svg"}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader className="flex-1">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold">
                                                        {post.category}
                                                    </Badge>
                                                    {post.tags?.slice(0, 2).map((tag: string) => (
                                                        <span key={tag} className="text-[10px] text-muted-foreground font-medium border-l border-border pl-2">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 leading-tight">{post.title}</CardTitle>
                                                <CardDescription className="line-clamp-2 mt-2">{post.excerpt}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(post.created_at).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {Math.ceil(post.content.split(" ").length / 200)} min read
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-primary text-sm font-bold group-hover:gap-2 transition-all">
                                                    Read Deep Dive
                                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
                            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-xl text-muted-foreground">No articles found in this category yet.</p>
                            <Link href="/blog" className="text-primary mt-4 inline-block hover:underline">View all articles</Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
