import Link from "next/link"
import { cn } from "@/lib/utils"
import { focusRing } from "@/lib/styles"
import { GitHubLogo, LinkedInLogo, XLogo } from "@/components/brand-logos"

const socials = [
  { href: "https://github.com/0xAfterSnow/", label: "GitHub", logo: <GitHubLogo size={16} /> },
  { href: "https://linkedin.com/in/shagbaoragber/", label: "LinkedIn", logo: <LinkedInLogo size={15} /> },
  { href: "https://x.com/0xAfterSnow", label: "X", logo: <XLogo size={14} /> },
]

export function BlogFooter() {
  return (
    <footer className="px-6 pt-16 pb-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Shagbaor Agber</p>
        <ul className="-ml-2 flex items-center gap-1">
          <li>
            <Link
              href="/"
              className={cn("rounded-md px-2 py-1 transition-colors duration-300 ease-soft hover:text-foreground", focusRing)}
            >
              Portfolio
            </Link>
          </li>
          {socials.map(({ href, label, logo }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cn(
                  "flex size-8 items-center justify-center rounded-md transition-colors duration-300 ease-soft hover:text-foreground",
                  focusRing,
                )}
              >
                {logo}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
