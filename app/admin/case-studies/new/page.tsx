import { CaseStudyForm } from "@/components/admin/case-study-form"

export default function NewCaseStudyPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New case study</h1>
        <p className="text-muted-foreground">Write up a project as an engineering case study. Only the basics are required.</p>
      </div>

      <CaseStudyForm />
    </div>
  )
}
