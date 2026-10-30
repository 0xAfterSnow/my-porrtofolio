"use client"

import { useEffect, useRef } from "react"

interface TaglineProps {
  mode: "backend" | "web3"
}

const lines = {
  backend: ["Good backend work is invisible.", "Requests return fast, data stays correct,", "and nobody gets paged at 3am."],
  web3: ["A smart contract can't be patched after launch.", "So I test every one like real money", "depends on it, because it does."],
}

// Each word lights up as it crosses a line 60% down the viewport.
export function Tagline({ mode }: TaglineProps) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const words = ref.current?.querySelectorAll<HTMLElement>(".tagline-word")
    if (!words?.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const lit = entry.isIntersecting || entry.boundingClientRect.top < 0
          entry.target.classList.toggle("is-lit", lit)
        })
      },
      { rootMargin: "0px 0px -40% 0px" },
    )
    words.forEach((word) => observer.observe(word))
    return () => observer.disconnect()
  }, [mode])

  return (
    <section aria-label="What I care about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p ref={ref} className="max-w-5xl text-4xl font-semibold tracking-tight md:text-5xl">
          {lines[mode].map((line, i) => (
            <span key={i} className="md:block">
              {line.split(" ").map((word, j) => (
                <span key={j} className="tagline-word">
                  {word}{" "}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
