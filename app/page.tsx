import { createServerClient } from "@/lib/supabase/server"
import { HomeClient } from "@/components/home-client"

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  const supabase = await createServerClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })

  return <HomeClient initialProjects={projects || []} />
}
