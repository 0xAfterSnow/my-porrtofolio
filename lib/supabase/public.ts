import { createClient } from "@supabase/supabase-js"

// Read-only client for public pages. It never touches cookies, so pages that use it can
// be cached and served from the CDN instead of being rendered on every visit.
export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
