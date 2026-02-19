import { BlogForm } from "@/components/admin/blog-form"

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
        <p className="text-muted-foreground">Write a new article</p>
      </div>

      <BlogForm />
    </div>
  )
}
