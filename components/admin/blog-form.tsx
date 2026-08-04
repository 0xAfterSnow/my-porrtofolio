"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Calendar, Clock, Eye, Upload, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RichTextEditor } from "./rich-text-editor"
import { Badge } from "@/components/ui/badge"
import { BlogContent } from "@/components/blog-content"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type BlogPost = {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image?: string
  category: string
  tags: string[]
  published: boolean
  created_at?: string
}

export function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    cover_image: post?.cover_image || "",
    category: post?.category || "backend",
    tags: post?.tags?.join(", ") || "",
    published: post?.published || false,
  })

  // Start with a default slug generation based on title, but allow manual edits
  useEffect(() => {
    if (!post?.id && formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, post?.id])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => {
      const newSlug = !post?.id ? generateSlug(title) : prev.slug
      return {
        ...prev,
        title,
        slug: newSlug
      }
    })
  }

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCover(true)
    setError(null)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `blog-covers/${fileName}`

      const { error: uploadError } = await supabase.storage.from("blog-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, cover_image: publicUrl }))
    } catch (err: any) {
      setError(err.message || "Failed to upload cover image")
    } finally {
      setUploadingCover(false)
    }
  }

  const removeCoverImage = () => {
    setFormData(prev => ({ ...prev, cover_image: "" }))
  }

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image || null,
        category: formData.category,
        tags: tagsArray,
        published: formData.published,
      }

      if (post?.id) {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", post.id)
        if (error) throw error

        toast({
          title: "Success",
          description: "Blog post updated successfully.",
        })
      } else {
        const { data, error } = await supabase.from("blog_posts").insert([postData]).select().single()
        if (error) throw error

        toast({
          title: "Success",
          description: "Blog post created successfully.",
        })

        if (data?.id) {
          router.replace(`/admin/blog/${data.id}/edit`)
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to save blog post")
      toast({
        title: "Error",
        description: err.message || "Failed to save blog post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate reading time for preview
  const readingTime = Math.ceil((formData.content?.split(" ").length || 0) / 200) || 1
  const previewDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
      {/* Editor Column */}
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{post?.id ? 'Edit Post' : 'New Post'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="post-url-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  disabled={loading}
                  rows={3}
                  placeholder="Brief summary for SEO and cards"
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <div className="min-h-[400px]">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Write your blog post content here..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex flex-col gap-4">
                  {!formData.cover_image ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer relative">
                      <input
                        id="cover_image_upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        disabled={uploadingCover || loading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {uploadingCover ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {uploadingCover ? "Uploading..." : "Click to upload cover image"}
                      </span>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-border group">
                      <img
                        src={formData.cover_image}
                        alt="Cover Preview"
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={removeCoverImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="web3">Web3</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="tips">Tips</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    disabled={loading}
                    placeholder="nodejs, web3, tutorial"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish immediately
                </Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : post?.id ? (
                    "Update Post"
                  ) : (
                    "Create Post"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading} className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview Column */}
      <div className="hidden lg:block space-y-6">
        <div className="sticky top-6">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Live Preview</span>
          </div>

          <Card className="glass-card overflow-hidden border-primary/20 bg-background/50 h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
            <CardContent className="p-0">
              <div className="min-h-full bg-background flex flex-col">
                {/* Preview Header */}
                <header className="relative pt-8 pb-10 px-6 bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge variant="secondary" className="uppercase tracking-wider font-bold text-[10px]">
                        {formData.category || "Category"}
                      </Badge>
                      {formData.tags?.split(',').filter(Boolean).map((tag) => (
                        <span key={tag} className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <span className="opacity-50">#</span>{tag.trim()}
                        </span>
                      ))}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance tracking-tight leading-[1.1]">
                      {formData.title || "Untitled Post"}
                    </h1>

                    <div className="flex items-center gap-6 text-xs text-muted-foreground border-t border-border pt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <time>{previewDate}</time>
                      </div>
                      <div className="flex items-center gap-2 border-l border-border pl-6">
                        <Clock className="h-3 w-3" />
                        <span>{readingTime} min read</span>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Preview Cover Image */}
                {formData.cover_image && (
                  <section className="w-full px-6 py-4">
                    <div className="relative aspect-[21/9] rounded-xl overflow-hidden shadow-md border border-border/50 bg-muted">
                      <img
                        src={formData.cover_image}
                        alt="Cover"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg" // Fallback
                        }}
                      />
                    </div>
                  </section>
                )}

                {/* Preview Content */}
                <section className="px-6 py-8">
                  {formData.content ? (
                    <BlogContent content={formData.content} />
                  ) : (
                    <div className="text-muted-foreground italic text-center py-10 opacity-50">
                      Start writing to see preview...
                    </div>
                  )}
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
