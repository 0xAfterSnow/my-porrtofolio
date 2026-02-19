"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Code2, Blocks, Github, Linkedin, Mail, X } from "lucide-react"
import { ResumeModal } from "@/components/resume-modal"
import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import PixelBlast from './PixelBlast';
import Aurora from './Aurora';
import { useTheme } from "next-themes"

interface HeroProps {
  mode: "backend" | "web3"
}

export function Hero({ mode }: HeroProps) {
  const [showResume, setShowResume] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const fullText = mode === "backend" ? "scalable systems" : "decentralized apps"
  const heroRef = useRef<HTMLDivElement>(null)
  const backendRef = useRef<HTMLDivElement>(null);
  const web3Ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let index = 0
    setDisplayedText("")
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [mode, fullText])

  /* Responsive Logic: Mobile Optimization */
  const [isDesktop, setIsDesktop] = useState(false)

  // Only render heavy visual effects on desktop (>1024px)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 1024px)").matches)
    }

    // Initial check
    checkDesktop()

    const mql = window.matchMedia("(min-width: 1024px)")
    mql.addEventListener("change", checkDesktop)

    return () => mql.removeEventListener("change", checkDesktop)
  }, [])

  // GSAP fade transition between backend ↔ web3
  useEffect(() => {
    if (!isDesktop) return; // Skip GSAP animations on mobile for performance

    const backend = backendRef.current;
    const web3 = web3Ref.current;
    if (!backend || !web3) return;

    if (mode === "backend") {
      gsap.to(web3, { opacity: 0, duration: 0.6, ease: "power2.out" });
      gsap.to(backend, { opacity: 1, duration: 0.8, ease: "power2.inOut" });
    } else if (mode === "web3") {
      gsap.to(backend, { opacity: 0, duration: 0.6, ease: "power2.out" });
      gsap.to(web3, { opacity: 1, duration: 0.8, ease: "power2.inOut" });
    }
  }, [mode, isDesktop]);


  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
    >
      {/* Desktop Visuals: PixelBlast & Aurora */}
      {isDesktop ? (
        <>
          {/* Backend Beams */}
          <div
            ref={backendRef}
            className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-700"
          >
            <PixelBlast
              variant="circle"
              pixelSize={6}
              color={mounted && theme === "light" ? "#000000" : "#ffffff"}
              patternDensity={1.2}
              pixelSizeJitter={0.5}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.6}
              edgeFade={0.25}
              transparent
              patternScale={3}
              className=""
              style={{}}
            />
          </div>

          {/* Web3 FaultyTerminal */}
          <div
            ref={web3Ref}
            className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-700"
          >
            <Aurora
              colorStops={mounted && theme === "dark" ? ["#000000", "#333333", "#1a1a1a"] : ["#ffffff", "#f5f5f5", "#e5e5e5"]}
              blend={0.5}
              amplitude={1.0}
              speed={1}
            />
          </div>
        </>
      ) : (
        /* Mobile Fallback: Lightweight Gradient */
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 transition-opacity duration-1000 ${mode === 'backend' ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--foreground-rgb),0.1)_0%,transparent_70%)] opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full opacity-30" />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-1000 ${mode === 'web3' ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--foreground-rgb),0.1)_0%,transparent_70%)] opacity-40" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full opacity-30" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full opacity-30" />
          </div>
        </div>
      )}

      <div className="absolute inset-0 cyber-grid opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
        <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in-up">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            {mode === "backend" ? (
              <Code2 className="h-5 w-5 text-foreground animate-glow-pulse relative z-10" />
            ) : (
              <Blocks className="h-5 w-5 text-foreground animate-glow-pulse relative z-10" />
            )}
          </div>
          <span className="text-sm font-bold tracking-widest uppercase text-foreground">
            {mode === "backend" ? "Backend Engineer" : "Web3 Developer"}
          </span>
        </div>

        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-foreground">
            Building{" "}
            <span className="relative inline-block">
              <span className="text-foreground">
                {displayedText}
                <span className="animate-blink">|</span>
              </span>
              <div
                className="absolute -inset-2 blur-2xl opacity-10 dark:opacity-20 animate-pulse bg-foreground"
              />
            </span>
            <br />
            that solve real problems
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            {mode === "backend"
              ? "Architecting robust APIs and microservices with Python, Django, and cloud infrastructure"
              : "Crafting smart contracts and DeFi protocols on Ethereum, Solana, and beyond"}
          </p>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Button
            size="lg"
            className="group relative text-base px-8 py-6 bg-foreground text-background hover:bg-foreground/90 font-semibold overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => scrollToSection("projects")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 flex items-center gap-2">
              View Projects
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="group relative text-base px-8 py-6 border-2 border-foreground/20 font-semibold overflow-hidden rounded-xl bg-transparent hover:bg-foreground/5 transition-all duration-300"
            onClick={() => setShowResume(true)}
          >
            <span className="relative z-10 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              View Resume
            </span>
          </Button>
        </div>

        <div
          className="flex gap-4 justify-center items-center pt-4 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="https://x.com/0xAfterSnow"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
          >
            <X className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
          <a
            href="https://linkedin.com/in/shagbaoragber/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
          >
            <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
          <a
            href="https://github.com/0xAfterSnow/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
          >
            <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
          <a
            href="mailto:dxtlive@gmail.com"
            className="p-3 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
          >
            <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
        </div>


      </div>

      <ResumeModal open={showResume} onOpenChange={setShowResume} mode={mode} />
    </section>
  )
}
