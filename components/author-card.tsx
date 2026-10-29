import Image from "next/image"
import { cn } from "@/lib/utils"
import { focusRing } from "@/lib/styles"
import { GitHubLogo, LinkedInLogo, XLogo } from "@/components/brand-logos"

interface AuthorCardProps {
    settings: any // Typing 'any' for now as we don't have a strict type for settings yet
}

export function AuthorCard({ settings }: AuthorCardProps) {
    const authorName = settings?.author_name || "Shagbaor Agber"
    const authorBio =
        settings?.author_bio ||
        settings?.site_description ||
        "Backend engineer and smart contract developer. I build APIs that stay up and contracts that hold real value."
    const avatarUrl = settings?.author_avatar_url
    const socials = [
        { href: settings?.social_github || "https://github.com/0xAfterSnow/", label: "GitHub", logo: <GitHubLogo size={16} /> },
        { href: settings?.social_linkedin || "https://linkedin.com/in/shagbaoragber/", label: "LinkedIn", logo: <LinkedInLogo size={15} /> },
        { href: settings?.social_twitter || "https://x.com/0xAfterSnow", label: "X", logo: <XLogo size={14} /> },
    ]

    return (
        <div className="flex flex-col gap-6 rounded-2xl bg-card p-6 sm:flex-row sm:items-start md:p-8">
            <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-foreground text-xl font-semibold text-background">
                {avatarUrl ? (
                    <Image src={avatarUrl} alt={authorName} fill sizes="64px" className="object-cover" />
                ) : (
                    "SA"
                )}
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Written by</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">{authorName}</h2>
                <p className="mt-2 max-w-[560px] text-base text-muted-foreground">{authorBio}</p>
                <ul className="-ml-2 mt-4 flex items-center gap-1">
                    {socials.map(({ href, label, logo }) => (
                        <li key={label}>
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className={cn(
                                    "flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-300 ease-soft hover:bg-secondary hover:text-foreground",
                                    focusRing,
                                )}
                            >
                                {logo}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
