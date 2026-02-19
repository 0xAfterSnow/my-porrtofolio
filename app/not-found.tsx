import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 text-center space-y-8 max-w-md mx-auto">
                <div className="relative">
                    <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-text-gradient select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 text-9xl font-black text-primary/10 blur-xl select-none animate-pulse">
                        404
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-destructive font-mono font-bold text-lg tracking-wider">
                        <AlertTriangle className="h-5 w-5" />
                        <span>SYSTEM_ERROR: SIGNAL_LOST</span>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight">
                        Navigation System Failure
                    </h2>

                    <p className="text-muted-foreground">
                        The coordinates you are trying to access do not exist in this sector.
                        The signal may have been intercepted or the link is corrupted.
                    </p>
                </div>

                <div className="pt-4">
                    <Button asChild size="lg" className="group rounded-full px-8">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            Return to Base
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-8 text-xs font-mono text-muted-foreground/50">
                ERROR_CODE: PAGE_NOT_FOUND_EXCEPTION
            </div>
        </div>
    )
}
