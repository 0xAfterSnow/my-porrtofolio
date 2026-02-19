import type { MetadataRoute } from "next"
import { createServerClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shagbaor.is-a.dev/"
    const supabase = await createServerClient()

    // Get all published blog posts
    const { data: posts } = await supabase
        .from("blog_posts")
        .select("slug, created_at")
        .eq("published", true)

    const blogEntries: MetadataRoute.Sitemap = (posts || []).map((post: { slug: string; created_at: string }) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.created_at),
        changeFrequency: "weekly",
        priority: 0.8,
    }))

    const staticEntries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        // Add other static pages here if they exist
        // { url: `${baseUrl}/projects`, ... },
    ]

    return [...staticEntries, ...blogEntries]
}
