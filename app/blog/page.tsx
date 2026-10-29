import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"
import { trackPageView } from "@/lib/analytics-server"
import { cn } from "@/lib/utils"
import { focusRing } from "@/lib/styles"
import { BlogNavbar } from "@/components/blog-navbar"
import { BlogFooter } from "@/components/blog-footer"
import { BlogPostCard, type BlogPost } from "@/components/blog-post-card"
import { Reveal } from "@/components/section"
import { getSiteSettings } from "@/lib/get-settings"

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings()
    const title = settings?.site_title ? `Blog | ${settings.site_title}` : "Developer Blog | Shagbaor Agber"
    const description = "Insights on Backend Engineering, Web3 Architecture, and Full-Stack Development by Shagbaor Agber."

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: "https://aftersnow.xyz/blog", // Ideally use siteUrl from settings
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: "/blog",
        },
    }
}

const categories = [
    { value: "all", label: "All posts" },
    { value: "backend", label: "Backend" },
    { value: "web3", label: "Web3" },
    { value: "tips", label: "Tips" },
]

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const supabase = await createServerClient()
    const { category } = await searchParams
    const active = category && category !== "all" ? category : "all"

    let query = supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false })

    if (active !== "all") {
        query = query.eq("category", active)
    }

    const { data } = await query
    const posts = (data ?? []) as BlogPost[]
    // The newest post leads the unfiltered view.
    const [featured, ...rest] = active === "all" ? posts : [undefined, ...posts]

    await trackPageView("blog")

    return (
        <>
            <BlogNavbar />

            <main id="main" className="px-6 pt-40 pb-12">
                <div className="mx-auto max-w-6xl">
                    <Reveal>
                        <header className="grid gap-4 md:grid-cols-12 md:gap-8">
                            <p className="text-sm font-medium text-muted-foreground md:col-span-3 md:pt-4">Blog</p>
                            <div className="md:col-span-9">
                                <h1 className="text-hero max-w-[680px] pb-1 text-5xl font-semibold tracking-tighter md:text-6xl">
                                    Notes from the backend and onchain
                                </h1>
                                <p className="mt-6 max-w-[560px] text-lg text-muted-foreground">
                                    Deep dives, lessons from production, and small tips on backend engineering and Web3
                                    development.
                                </p>
                            </div>
                        </header>
                    </Reveal>

                    <nav aria-label="Blog categories" className="mt-16 flex flex-wrap gap-2 border-b border-border pb-6">
                        {categories.map(({ value, label }) => {
                            const current = active === value
                            return (
                                <Link
                                    key={value}
                                    href={value === "all" ? "/blog" : `/blog?category=${value}`}
                                    aria-current={current ? "page" : undefined}
                                    className={cn(
                                        "rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300 ease-soft",
                                        current
                                            ? "bg-foreground text-background"
                                            : "text-muted-foreground ring-1 ring-border hover:text-foreground hover:ring-foreground/30",
                                        focusRing,
                                    )}
                                >
                                    {label}
                                </Link>
                            )
                        })}
                    </nav>

                    {posts.length === 0 ? (
                        <Reveal>
                            <div className="mt-12 rounded-2xl bg-card p-8 md:p-12">
                                <h2 className="text-xl font-semibold">Nothing in this category yet</h2>
                                <p className="mt-2 max-w-md text-muted-foreground">
                                    New posts land here first. In the meantime, the rest of the writing is one click away.
                                </p>
                                <Link
                                    href="/blog"
                                    className={cn(
                                        "mt-6 inline-flex rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background transition-[transform,background-color] duration-300 ease-soft hover:bg-foreground/85 active:scale-[0.98]",
                                        focusRing,
                                    )}
                                >
                                    See all posts
                                </Link>
                            </div>
                        </Reveal>
                    ) : (
                        <div className="mt-12 space-y-4">
                            {featured && (
                                <Reveal>
                                    <BlogPostCard post={featured} featured />
                                </Reveal>
                            )}
                            {rest.length > 0 && (
                                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {rest.map((post, i) =>
                                        post ? (
                                            <li key={post.id}>
                                                <Reveal delay={(i % 3) * 80} className="h-full">
                                                    <BlogPostCard post={post} />
                                                </Reveal>
                                            </li>
                                        ) : null,
                                    )}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <BlogFooter />
        </>
    )
}
