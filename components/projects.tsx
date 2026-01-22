"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Sparkles, Github } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ProjectsProps {
  mode: "backend" | "web3"
}


export function Projects({ mode }: ProjectsProps) {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      const supabase = createBrowserSupabaseClient()

      const { data } = await supabase
        .from("projects")
        .select("*")
        .or(`category.eq.${mode},category.eq.both`)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })

      setProjects(data || [])
      setLoading(false)
    }

    fetchProjects()
  }, [mode])

  return (
    <section id="projects" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-primary animate-glow-pulse" />
            <h2 className="text-5xl md:text-6xl font-bold">
              Featured{" "}
              <span className="text-foreground animate-glow-pulse">{mode === "backend" ? "Backend" : "Web3"}</span>{" "}
              Projects
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Building scalable systems that power real-world applications
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group relative glass-card hover:border-primary transition-all duration-500 hover:scale-[1.02] overflow-hidden p-0 pb-3"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent pointer-events-none" />

                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-transparent" />
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span className="font-bold">{project.title}</span>
                    <div className="flex gap-2">
                      {project.github && (
                        <Link href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </Link>
                      )}
                      {project.demo && (
                        <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </Link>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base text-justify">{project.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  {project.impact && project.impact !== "" ? (
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-accent font-medium leading-relaxed">{project.impact}</p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <div></div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech: string, i: number) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs font-semibold px-3 py-1 bg-secondary/80 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
