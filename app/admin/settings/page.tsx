"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, RefreshCw } from "lucide-react"
import { flushSettingsCache } from "@/app/actions/flush-cache"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [flushing, setFlushing] = useState(false)
  const [settings, setSettings] = useState<any>(null)
  const { toast } = useToast()
  const supabase = createBrowserSupabaseClient()

  async function handleFlush() {
    setFlushing(true)
    try {
      await flushSettingsCache()
      toast({
        title: "Success",
        description: "Cache flushed successfully. Updates should be visible.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to flush cache",
        variant: "destructive",
      })
    } finally {
      setFlushing(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const { data, error } = await supabase.from("site_settings").select("*").single()

      if (error) throw error
      setSettings(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: string) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("blog-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath)

      setSettings({ ...settings, [field]: publicUrl })

      toast({
        title: "Success",
        description: "File uploaded successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your portfolio settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic information about your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_title">Site Title</Label>
                <Input
                  id="site_title"
                  value={settings?.site_title || ""}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_tagline">Tagline</Label>
                <Input
                  id="site_tagline"
                  value={settings?.site_tagline || ""}
                  onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                  placeholder="Web3 + Backend Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings?.site_description || ""}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  placeholder="A brief description of your portfolio"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                <Input
                  id="google_analytics_id"
                  value={settings?.google_analytics_id || ""}
                  onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author_name">Name</Label>
                <Input
                  id="author_name"
                  value={settings?.author_name || ""}
                  onChange={(e) => setSettings({ ...settings, author_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_bio">Bio</Label>
                <Textarea
                  id="author_bio"
                  value={settings?.author_bio || ""}
                  onChange={(e) => setSettings({ ...settings, author_bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_avatar">Avatar</Label>
                <div className="flex items-center gap-4">
                  {settings?.author_avatar_url && (
                    <img
                      src={settings.author_avatar_url || "/placeholder.svg"}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      id="author_avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "author_avatar_url")}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume PDF</Label>
                <div className="flex items-center gap-4">
                  {settings?.resume_url && (
                    <a
                      href={settings.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View current resume
                    </a>
                  )}
                  <div className="flex-1">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, "resume_url")}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social_github">GitHub</Label>
                <Input
                  id="social_github"
                  value={settings?.social_github || ""}
                  onChange={(e) => setSettings({ ...settings, social_github: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_linkedin">LinkedIn</Label>
                <Input
                  id="social_linkedin"
                  value={settings?.social_linkedin || ""}
                  onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_twitter">Twitter/X</Label>
                <Input
                  id="social_twitter"
                  value={settings?.social_twitter || ""}
                  onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_email">Email</Label>
                <Input
                  id="social_email"
                  type="email"
                  value={settings?.social_email || ""}
                  onChange={(e) => setSettings({ ...settings, social_email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Search engine optimization defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_keywords">Keywords (comma-separated)</Label>
                <Input
                  id="seo_keywords"
                  value={settings?.seo_keywords?.join(", ") || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      seo_keywords: e.target.value.split(",").map((k) => k.trim()),
                    })
                  }
                  placeholder="web3, blockchain, backend, nodejs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image">Open Graph Image</Label>
                <div className="flex items-center gap-4">
                  {settings?.og_image_url && (
                    <img
                      src={settings.og_image_url || "/placeholder.svg"}
                      alt="OG Image"
                      className="h-24 w-auto rounded border"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      id="og_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "og_image_url")}
                      disabled={uploading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x630px</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleFlush} disabled={flushing}>
          {flushing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Flushing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Flush Cache
            </>
          )}
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </div>
  )
}
