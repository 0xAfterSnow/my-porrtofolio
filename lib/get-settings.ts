import { createClient } from "@supabase/supabase-js"
import { unstable_cache } from "next/cache"

export const getSiteSettings = unstable_cache(
    async () => {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        try {
            const { data, error } = await supabase.from("site_settings").select("*").single()
            if (error) return null
            return data
        } catch (error) {
            console.error("Error fetching site settings:", error)
            return null
        }
    },
    ["site_settings"],
    { revalidate: 3600, tags: ["site_settings"] }
)
