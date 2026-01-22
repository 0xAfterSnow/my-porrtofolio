import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Blocks } from "lucide-react"

interface AboutProps {
  mode: "backend" | "web3"
}

const backendStack = [
  "Python",
  "Django",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Celery",
  "REST APIs",
]

const web3Stack = [
  "Solidity",
  "Wagmi",
  "The Graph",
  "Ethers.js",
  "Hardhat",
  "IPFS",
  "OpenZeppelin",
  "Algorand",
  "EVM Chains",
  "Web3.js",
]

export function About({ mode }: AboutProps) {
  return (
    <section id="about" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">About Me</h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">Bridging two worlds of engineering</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card
            className={`relative border-2 transition-all duration-500 glass-card overflow-hidden ${mode === "backend"
              ? "border-primary shadow-2xl shadow-primary/30 scale-105"
              : "border-border hover:border-primary/50"
              }`}
          >
            {mode === "backend" && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            )}

            <CardHeader className="relative">
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                <div className="relative">
                  <Server className="h-8 w-8 text-primary" />
                  {mode === "backend" && <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse" />}
                </div>
                <span className="font-bold">Backend Engineering</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <p className="text-muted-foreground leading-relaxed text-base">
                I build robust, scalable backend systems that handle millions of requests. From API design to database
                optimization, I ensure reliability and performance at every layer.
              </p>

              <div className="flex flex-wrap gap-2">
                {backendStack.map((tech, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-sm font-semibold px-3 py-1.5 bg-secondary/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`relative border-2 transition-all duration-500 glass-card overflow-hidden ${mode === "web3"
              ? "border-zinc-500 shadow-2xl shadow-zinc-500/20 scale-105"
              : "border-border hover:border-zinc-500/50"
              }`}
          >
            {mode === "web3" && (
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
            )}

            <CardHeader className="relative">
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                <div className="relative">
                  <Blocks className="h-8 w-8 text-zinc-400" />
                  {mode === "web3" && <div className="absolute inset-0 bg-zinc-400/30 blur-xl animate-pulse" />}
                </div>
                <span className="font-bold">Web3 Development</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <p className="text-muted-foreground leading-relaxed text-base">
                I create decentralized applications that leverage blockchain technology. From smart contracts to
                multichain integrations, I bring Web3 innovation to life with security and user experience in mind.
              </p>

              <div className="flex flex-wrap gap-2">
                {web3Stack.map((tech, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-sm font-semibold px-3 py-1.5 bg-secondary/80 hover:bg-zinc-700 hover:text-zinc-100 transition-all duration-300"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="relative neon-border glass-card overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
          <CardContent className="pt-8 pb-8 relative">
            <p className="text-lg md:text-xl text-foreground leading-relaxed text-center max-w-4xl mx-auto font-light">
              With <span className="text-foreground font-semibold">5+ years</span> of experience building production
              systems, I specialize in creating applications that combine the{" "}
              <span className="text-foreground font-semibold">reliability of traditional backend engineering</span> with
              the <span className="text-zinc-400 font-semibold">innovation of Web3 technology</span>. I've worked with
              startups and enterprises to deliver scalable solutions that solve real-world problems.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
