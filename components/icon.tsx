import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

export type IconType = IconSvgElement

interface IconProps {
  icon: IconSvgElement
  size?: number
  className?: string
}

// One stroke weight for every icon on the site.
export function Icon({ icon, size = 18, className }: IconProps) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.75} className={className} aria-hidden="true" />
}
