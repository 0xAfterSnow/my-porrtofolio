import { cn } from "@/lib/utils"

// Shared class strings. Kept out of client modules so server components can use them.
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export const buttonPrimary = cn(
  "inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-3 py-2 text-base font-semibold text-background",
  "transition-[transform,background-color] duration-300 ease-soft hover:bg-foreground/85 active:scale-[0.98]",
  focusRing,
)

export const buttonQuiet = cn(
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-base font-semibold text-foreground",
  "transition-[transform,background-color] duration-300 ease-soft hover:bg-secondary active:scale-[0.98]",
  focusRing,
)

export const iconButton = cn(
  "inline-flex size-10 items-center justify-center rounded-full text-muted-foreground",
  "transition-[transform,background-color,color] duration-300 ease-soft hover:bg-secondary hover:text-foreground active:scale-[0.98]",
  focusRing,
)
