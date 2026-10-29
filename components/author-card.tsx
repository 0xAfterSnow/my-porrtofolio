import Image from "next/image"
import Link from "next/link"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { focusRing } from "@/lib/styles"
import { Icon } from "@/components/icon"
import { GitHubLogo, LinkedInLogo, XLogo } from "@/components/brand-logos"

interface AuthorCardProps {
    settings: any // Typing 'any' for now as we don't have a strict type for settings yet
}

const pill = cn(
    "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ring-1 ring-border transition-[background-color,color,box-shadow] duration-300 ease-soft hover:bg-foreground hover:text-background hover:ring-foreground active:scale-[0.98]",
    focusRing,
)

export function AuthorCard({ settings }: AuthorCardProps) {
    const authorName = settings?.author_name || "Shagbaor Agber"
    const rawBio =
        settings?.author_bio ||
        settings?.site_description ||
        "Backend engineer and smart contract developer. I build APIs that stay up and contracts that hold real value."
    // The saved bio often opens with the name, which already sits right above it.
    const escapedName = authorName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const authorBio = rawBio.replace(new RegExp(`^${escapedName}\\s*[—–-]\\s*`), "")
    const avatarUrl = settings?.author_avatar_url
    const socials = [
        { href: settings?.social_github || "https://github.com/0xAfterSnow/", label: "GitHub", logo: <GitHubLogo size={16} /> },
        { href: settings?.social_linkedin || "https://linkedin.com/in/shagbaoragber/", label: "LinkedIn", logo: <LinkedInLogo size={15} /> },
        { href: settings?.social_twitter || "https://x.com/0xAfterSnow", label: "X", logo: <XLogo size={14} /> },
    ]

    return (
        <section aria-label="About the author" className="border-y border-border py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-lg font-semibold text-background ring-1 ring-border">
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt={authorName} fill sizes="64px" className="object-cover" />
                        ) : (
                            "SA"
                        )}
                    </span>
                    <div>
                        <p className="text-sm text-muted-foreground">Written by</p>
                        <h2 className="text-2xl font-semibold tracking-tight">{authorName}</h2>
                    </div>
                </div>
                <Link
                    href="/"
                    className={cn(
                        "group inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-300 ease-soft hover:bg-secondary sm:self-auto",
                        focusRing,
                    )}
                >
                    View portfolio
                    <Icon icon={ArrowRight02Icon} size={16} className="transition-transform duration-500 ease-soft group-hover:translate-x-1" />
                </Link>
            </div>

            <p className="mt-6 max-w-[640px] text-base text-foreground/80">{authorBio}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
                {socials.map(({ href, label, logo }) => (
                    <li key={label}>
                        <a href={href} target="_blank" rel="noopener noreferrer" className={pill}>
                            {logo}
                            {label}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    )
}
