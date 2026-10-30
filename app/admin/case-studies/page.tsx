import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CaseStudyActions } from "@/components/admin/case-study-actions"

export default async function CaseStudiesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: caseStudies, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching case studies:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground">Manage your client success stories</p>
        </div>
        <Button asChild>
          <Link href="/admin/case-studies/new">
            <Plus className="mr-2 h-4 w-4" />
            New Case Study
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {caseStudies?.map((study) => (
          <Card key={study.id} className="glass-card overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img src={study.image || "/placeholder.svg"} alt={study.title} className="object-cover w-full h-full" />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{study.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{study.client}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={study.category === "backend" ? "default" : "secondary"}>{study.category}</Badge>
                    <Badge variant={study.published ? "default" : "outline"}>
                      {study.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Link href={`/admin/case-studies/${study.id}/edit`}>Edit</Link>
                </Button>
                {study.published && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/case-studies/${study.slug}`} target="_blank">
                      View
                    </Link>
                  </Button>
                )}
                <CaseStudyActions studyId={study.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!caseStudies || caseStudies.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No case studies yet</p>
            <Button asChild>
              <Link href="/admin/case-studies/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Case Study
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
