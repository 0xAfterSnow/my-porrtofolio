import { createPublicClient } from "@/lib/supabase/public"
import { HomeClient } from "@/components/home-client"
import { GITHUB_USERNAME, getContributions } from "@/lib/github"

// Cached and served from the CDN, rebuilt at most every 5 minutes. Saving a case study
// rebuilds it straight away.
export const revalidate = 300

export default async function Home() {
  const supabase = createPublicClient()

  const [{ data: projects }, { data: caseStudies }, { data: settings }, contributions] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("case_studies").select("*").eq("published", true).order("created_at", { ascending: false }),
    supabase.from("site_settings").select("author_avatar_url").maybeSingle(),
    getContributions(GITHUB_USERNAME),
  ])

  return (
    <HomeClient
      initialProjects={projects || []}
      initialCaseStudies={caseStudies || []}
      avatarUrl={settings?.author_avatar_url}
      contributions={contributions}
    />
  )
}
