import { createServerSupabaseClient } from "@/lib/supabase/server"
import { CaseStudyForm } from "@/components/admin/case-study-form"
import { notFound } from "next/navigation"

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: study, error } = await supabase.from("case_studies").select("*").eq("id", id).single()

  if (error || !study) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit case study</h1>
        <p className="text-muted-foreground">Sections left empty are hidden on the public page.</p>
      </div>

      <CaseStudyForm study={study} />
    </div>
  )
}
