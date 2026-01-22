import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, X, Mail, Send } from "lucide-react"
import { ResumeModal } from "@/components/resume-modal"


export function Contact() {
  const [showResume, setShowResume] = useState(false)
  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-zinc-500/10 to-background" />
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] animate-pulse" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-8">Let's Build Together</h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-16 text-balance font-light max-w-3xl mx-auto">
          Whether you need scalable backend systems or innovative Web3 solutions, I'm here to help bring your ideas to
          life.
        </p>

        <Card className="relative neon-border glass-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-zinc-500/5" />

          <CardContent className="pt-12 pb-12 relative">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
              <Button
                size="lg"
                className="group relative text-lg px-10 py-7 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold overflow-hidden"
                onClick={() => (window.location.href = "mailto:dxtlive@gmail.com")}
              >
                <span className="relative z-10 flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 border-2 border-zinc-200 dark:border-zinc-700 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold transition-all duration-300 bg-transparent"
                onClick={() => setShowResume(true)}
              >
                View Resume
              </Button>
            </div>

            <div className="flex justify-center gap-8">
              <a
                href="https://x.com/CodeShagbaor"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <X className="h-7 w-7" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="sr-only">X</span>
              </a>

              <a
                href="https://linkedin.com/in/shagbaoragber/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Linkedin className="h-7 w-7" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="sr-only">LinkedIn</span>
              </a>

              <a
                href="https://github.com/Codewithshagbaor/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Github className="h-7 w-7" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="sr-only">GitHub</span>
              </a>

            </div>
          </CardContent>
        </Card>

        <p className="mt-16 text-sm text-muted-foreground font-light">
          © 2025. Built with Next.js and deployed on Vercel.
        </p>
      </div>

      <ResumeModal open={showResume} onOpenChange={setShowResume} mode="backend" />

    </section>
  )
}
