import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

interface AuthorCardProps {
    settings: any // Typing 'any' for now as we don't have a strict type for settings yet
}

export function AuthorCard({ settings }: AuthorCardProps) {
    const authorName = settings?.author_name || "Shagbaor Agber"
    const authorBio = settings?.author_bio || settings?.site_description || "Backend Engineer & Web3 Enthusiast. Building scalable systems and decentralized applications."
    const avatarUrl = settings?.author_avatar_url || "/placeholder-avatar.jpg" // Fallback
    const github = settings?.social_github
    const linkedin = settings?.social_linkedin
    const twitter = settings?.social_twitter

    return (
        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
            <CardContent className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <Avatar className="h-24 w-24 border-2 border-background shadow-xl">
                    <AvatarImage src={avatarUrl} alt={authorName} className="object-cover" />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                        {authorName.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="text-xl font-bold mb-1">{authorName}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                            {authorBio}
                        </p>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-4">
                        {twitter && (
                            <Link href={twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                        )}
                        {github && (
                            <Link href={github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        )}
                        {linkedin && (
                            <Link href={linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
