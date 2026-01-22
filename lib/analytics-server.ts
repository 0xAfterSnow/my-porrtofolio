import { createServerClient } from "@/lib/supabase/server"

export async function trackPageView(pageType: "project" | "blog_post" | "case_study" | "blog", pageId?: string) {
    try {
        const supabase = await createServerClient()

        // Track the view
        await supabase.from("page_views").insert({
            page_type: pageType,
            page_id: pageId || null,
        })

        // Increment the counter if pageId exists
        if (pageId) {
            await supabase.rpc("increment_view_count", {
                p_page_type: pageType,
                p_page_id: pageId,
            })
        }
    } catch (error) {
        console.error("[v0] Error tracking page view:", error)
    }
}

export async function getAnalytics() {
    try {
        const supabase = await createServerClient()

        // Get total views
        const { count: totalViews } = await supabase.from("page_views").select("*", { count: "exact", head: true })

        // Get views by page type
        const { data: viewsData } = await supabase.from("page_views").select("page_type")

        const viewsByType = viewsData?.reduce((acc: any, view: any) => {
            acc[view.page_type] = (acc[view.page_type] || 0) + 1
            return acc
        }, {})

        // Get recent views (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const { count: recentViews } = await supabase
            .from("page_views")
            .select("*", { count: "exact", head: true })
            .gte("created_at", sevenDaysAgo.toISOString())

        // Get views for last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { count: monthlyViews } = await supabase
            .from("page_views")
            .select("*", { count: "exact", head: true })
            .gte("created_at", thirtyDaysAgo.toISOString())

        return {
            totalViews: totalViews || 0,
            recentViews: recentViews || 0,
            monthlyViews: monthlyViews || 0,
            viewsByType: viewsByType || {},
        }
    } catch (error) {
        console.error("[v0] Error fetching analytics:", error)
        return {
            totalViews: 0,
            recentViews: 0,
            monthlyViews: 0,
            viewsByType: {},
        }
    }
}
