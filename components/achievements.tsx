"use client"

import { Card } from "@/components/ui/card"
import { Award, Trophy, Target, Zap } from "lucide-react"

interface AchievementsProps {
  mode: "backend" | "web3"
}

export function Achievements({ mode }: AchievementsProps) {
  const achievements = [
    {
      icon: Trophy,
      title: "Community Choice Award - Crypto Cities Hackathon",
      description: "Voted best project by community",
      year: "2025",
      relevant: "web3",
    },
    {
      icon: Zap,
      title: "Maintainer - AmongFriends Protocol",
      description: "Maintained a protocol that enables peerto-peer wagering without centralized control",
      year: "2025-Present",
      relevant: "web3",
    },
    {
      icon: Award,
      title: "EDU Chain Developer Certificate",
      description: "Completed EDU Chain Developer Program",
      year: "2025",
      relevant: "web3",
    },
    {
      icon: Award,
      title: "Ethereum Developer Certification",
      description: "Alchemy University",
      year: "2024",
      relevant: "web3",
    },
    {
      icon: Award,
      title: "Greenfield Certificate - Hackquest",
      description: "Completed Greenfield Learner Certificate track in Hackquest",
      year: "2024",
      relevant: "web3",
    },
    {
      icon: Trophy,
      title: "Algorand Hackathon Winner (Secuda) ",
      description: "Won 1st place at Algorand Global Hackathon 2024",
      year: "2024",
      relevant: "web3",
    },
    // Backend Achievements
    {
      icon: Award,
      title: "Automate with Python Certification",
      description: "Udemy Course Completion",
      year: "2024",
      relevant: "backend",
    },
    {
      icon: Award,
      title: "Master Python Web Scraping & Automation using BS4 & Selenium",
      description: "Udemy Course Completion",
      year: "2024",
      relevant: "backend",
    },
    {
      icon: Award,
      title: "PyTorch Ultimate Bootcamp - Python Deep Learning",
      description: "Udemy Course Completion",
      year: "2024",
      relevant: "backend",
    },
    {
      icon: Award,
      title: "Django for Everybody Specialization",
      description: "University of Michigan - Coursera",
      year: "2023",
      relevant: "backend",
    },
    {
      icon: Target,
      title: "99.99% Uptime Achievement",
      description: "Maintained critical systems for 1+ years",
      year: "2023-2024",
      relevant: "backend",
    },
    {
      icon: Trophy,
      title: "Github Actions for CI/CD DevOps Pipelines",
      description: "Professional level certification",
      year: "2023",
      relevant: "backend",
    },

  ]

  const filteredAchievements = achievements.filter((a) => a.relevant === mode)

  return (
    <section id="achievements" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Achievements & <span className="text-foreground">Certifications</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Recognized expertise and proven track record
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement, index) => {
            const Icon = achievement.icon
            return (
              <Card
                key={index}
                className="p-6 bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-500 group hover:scale-[1.05] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
                    <div className="relative p-3 bg-primary/10 rounded-xl border border-foreground/20 group-hover:border-primary/40 transition-colors">
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-foreground transition-colors">
                      {achievement.title}
                    </h3>
                    <p className="text-muted-foreground mb-2">{achievement.description}</p>
                    <p className="text-sm text-foreground font-semibold">{achievement.year}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
