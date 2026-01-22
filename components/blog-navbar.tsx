"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Newspaper, ArrowLeft, Home, Code2, Blocks, Briefcase } from "lucide-react"
import { useEffect, useState } from "react"

export function BlogNavbar() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
                {/* Left: Brand */}
                <div className="flex-1">
                    <Link href="/" className="flex items-center gap-2 group transition-all w-fit">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Home className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold hidden sm:inline-block">Portfolio</span>
                    </Link>
                </div>

                {/* Center: Menu */}
                <div className="flex items-center justify-center gap-4 md:gap-8">
                    <Link href="/blog" className="text-xs md:text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 md:gap-2 py-2 border-b-2 border-primary">
                        <Newspaper className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Blog</span>
                    </Link>
                    <Link href="/#projects" className="text-xs md:text-sm font-medium hover:text-primary transition-colors">
                        Projects
                    </Link>
                    <Link href="/#about" className="text-xs md:text-sm font-medium hover:text-primary transition-colors">
                        About
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex-1 flex items-center justify-end gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5 text-zinc-400 group-hover:text-primary" />
                        ) : (
                            <Moon className="h-5 w-5 text-zinc-600 group-hover:text-primary" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    <Link href="/#contact">
                        <Button size="sm" className="hidden sm:flex font-semibold">
                            Get In Touch
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
