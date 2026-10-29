import { createServerClient } from "@/lib/supabase/server"
import { HomeClient } from "@/components/home-client"
import { GITHUB_USERNAME, getContributions } from "@/lib/github"

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  const supabase = await createServerClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })

  const [{ data: settings }, contributions] = await Promise.all([
    supabase.from("site_settings").select("author_avatar_url").single(),
    getContributions(GITHUB_USERNAME),
  ])

  return (
    <HomeClient
      initialProjects={projects || []}
      avatarUrl={settings?.author_avatar_url}
      contributions={contributions}
    />
  )
}
