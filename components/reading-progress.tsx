"use client"

import { useEffect, useRef } from "react"

// Thin bar at the top that fills as the article is read. Scroll work is batched per frame.
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      const progress = max > 0 ? el.scrollTop / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-0.5">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-foreground" />
    </div>
  )
}
