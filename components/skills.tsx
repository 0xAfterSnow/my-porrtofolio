"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"

interface SkillsProps {
  mode: "backend" | "web3"
}

export function Skills({ mode }: SkillsProps) {
  const backendSkills = [
    { name: "Python", level: 95, icon: "/icons/python.svg" },
    { name: "Django", level: 90, icon: "/icons/django.svg" },
    { name: "FastAPI", level: 85, icon: "/icons/fastapi.svg" },
    { name: "PostgreSQL", level: 88, icon: "/icons/postgresql.svg" },
    { name: "Redis", level: 82, icon: "/icons/redis.svg" },
    { name: "Docker", level: 87, icon: "/icons/docker.svg" },
    { name: "AWS", level: 80, icon: "/icons/aws.svg" },
    { name: "GraphQL", level: 83, icon: "/icons/graphql.svg" },
  ]

  const web3Skills = [
    { name: "Solidity", level: 92, icon: "/icons/solidity.svg" },
    { name: "Ethereum", level: 90, icon: "/icons/ethereum.svg" },
    { name: "Web3.js", level: 88, icon: "/icons/web3js.svg" },
    { name: "Hardhat", level: 85, icon: "/icons/hardhat.svg" },
    { name: "IPFS", level: 80, icon: "/icons/ipfs-dark.svg" },
    { name: "Smart Contracts", level: 93, icon: "/icons/file-type-solidity.svg" },
    { name: "DeFi", level: 87, icon: "/icons/defi.svg" },
    { name: "NFTs", level: 84, icon: "/icons/nfts.svg" },
  ]

  const skills = mode === "backend" ? backendSkills : web3Skills
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const floatingTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!floatingTextRef.current) return

    const texts = floatingTextRef.current.querySelectorAll(".floating-text")

    texts.forEach((text, index) => {
      gsap.to(text, {
        y: "random(-30, 30)",
        x: "random(-30, 30)",
        rotation: "random(-15, 15)",
        duration: "random(4, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.3,
      })
    })
  }, [mode])

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className={`absolute inset-0 bg-gradient-to-b ${mode === "backend"
        ? "from-primary/5 via-transparent to-muted/5"
        : "from-muted/10 via-transparent to-muted/20"
        }`}
      />

      <div ref={floatingTextRef} className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div
          className="floating-text absolute text-6xl font-bold text-primary/20"
          style={{
            left: "10%",
            top: "20%",
          }}
        >
          {mode === "backend" ? "API" : "WEB3"}
        </div>
        <div
          className="floating-text absolute text-5xl font-bold text-muted-foreground/20"
          style={{
            right: "15%",
            top: "40%",
          }}
        >
          {mode === "backend" ? "DB" : "DEFI"}
        </div>
        <div
          className="floating-text absolute text-7xl font-bold text-foreground/10"
          style={{
            left: "50%",
            bottom: "25%",
          }}
        >
          {mode === "backend" ? "OPS" : "NFT"}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-7xl font-bold mb-4 text-foreground"
          >
            {mode === "backend" ? "Backend Arsenal" : "Web3 Toolkit"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {mode === "backend"
              ? "Building scalable systems with cutting-edge backend technologies"
              : "Crafting decentralized applications with blockchain expertise"}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="group relative"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className={`glass-card p-6 rounded-2xl transition-all duration-500 ${hoveredSkill === skill.name ? "scale-110 -translate-y-2" : ""
                  }`}
                style={{
                  boxShadow:
                    hoveredSkill === skill.name
                      ? mode === "backend"
                        ? "0 20px 60px rgba(255, 255, 255, 0.2)"
                        : "0 20px 60px rgba(161, 161, 170, 0.2)"
                      : "none",
                }}
              >
                <img
                  src={skill.icon}
                  className="mb-4 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12"
                  alt={skill.name}
                  style={{ width: "48px", height: "48px" }}
                />

                {/* Skill Name */}
                <h3 className="text-xl font-bold mb-3 text-foreground">{skill.name}</h3>

                {/* Progress Bar */}
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${mode === "backend"
                      ? "bg-gradient-to-r from-zinc-100 to-zinc-400"
                      : "bg-gradient-to-r from-zinc-400 to-zinc-700"
                      }`}
                    style={{
                      width: hoveredSkill === skill.name ? `${skill.level}%` : "0%",
                      boxShadow:
                        mode === "backend" ? "0 0 10px rgba(255, 255, 255, 0.5)" : "0 0 10px rgba(161, 161, 170, 0.5)",
                    }}
                  />
                </div>

                {/* Skill Level */}
                <div className="mt-2 text-right">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {skill.level}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section >
  )
}
