"use client"

import { Briefcase, Calendar, MapPin } from "lucide-react"

interface WorkExperienceProps {
  mode: "backend" | "web3"
}

export function WorkExperience({ mode }: WorkExperienceProps) {
  const experiences = [
    {
      title: "Senior Backend Developer",
      company: "Claadme",
      location: "Nigeria",
      period: "08/2024 - 11/2024",
      type: "backend",
      description:
        "Company focused on social media platform development",
      achievements: [
        "Played a pivotal role in building and optimizing APIs for a cutting-edge social media platform",
        "Enhanced performance and reliability of backend services to support a seamless user experience",
        "Collaborated with frontend teams to ensure APIs met evolving user needs",
        "Developed a RESTful API that improved scalability and reduced latency",
        "Created a custom UI library that significantly increased developer productivity",
        "Implemented CI/CD pipelines to streamline deployment processes",
        "Mentored junior developers and conducted code reviews to ensure high code quality",
        "Committed to writing clean, modular code"
      ],
    },
    {
      title: "Backend Developer",
      company: "Mediconnect System Services",
      location: "Nigeria",
      period: "06/2023 - 04/2024",
      type: "backend",
      description:
        "Company specializing in medical technology services. Led backend development for scalable web apps.",
      achievements: [
        "Enhanced application performance and user experience",
        "Developed a RESTful API that improved scalability and reduced latency",
        "Created a custom UI library that significantly increased developer productivity",
        "Refactored legacy code and optimized database queries",
        "Implemented CI/CD pipelines to streamline deployment processes",
        "Mentored junior developers and conducted code reviews to ensure high code quality",
        "Committed to writing clean, modular code"
      ],
    },
    {
      title: "Wordpress Developer",
      company: "Better Life Nija",
      location: "Nigeria",
      period: "06/2022 - 12/2022",
      type: "backend",
      description:
        "A company focused on creating impactful WordPress sites and web applications. Led backend development for scalable web apps.",
      achievements: [
        "Developed and maintained WordPress websites ensuring they were fast, secure, and user-friendly",
        "Created custom themes and plugins to enhance functionality",
        "Collaborated with designers and project managers to meet project timelines",
        "Optimized website performance and SEO",
        "Provided training and support to clients for managing their WordPress sites",
        "Committed to writing clean, modular code"
      ],
    },
    {
      title: "Smart Contract Developer",
      company: "DeFi Protocol",
      location: "Remote",
      period: "2021 - 2022",
      type: "web3",
      description:
        "Developed and audited smart contracts for DeFi lending protocol with $50M+ TVL. Implemented automated market maker (AMM) functionality.",
      achievements: [
        "Deployed 15+ audited smart contracts",
        "Reduced gas costs by 35%",
        "Built comprehensive test suites",
      ],
    },
    {
      title: "Backend Developer",
      company: "Ceto Data Works",
      location: "Nigeria",
      period: "10/2019 - 10/2021",
      type: "backend",
      description: "Company specializing in data solutions",
      achievements: [
        "Developed robust backend applications with Django focusing on security and scalability",
        "Analyzed user needs and integrated external APIs",
        "Designed efficient database models",
        "Collaborated with front-end developers to enhance user experience",
        "Optimized application performance and scalability",
        "Ensured high code quality through automated testing and code reviews"
      ],
    },
    {
      title: "Blockchain Developer",
      company: "NFT Marketplace",
      location: "Remote",
      period: "2019 - 2020",
      type: "web3",
      description: "Created NFT minting and trading platform on Ethereum. Integrated IPFS for decentralized storage.",
      achievements: [
        "Built ERC-721 token contracts",
        "Implemented Web3 wallet integration",
        "Optimized transaction batching",
      ],
    },
  ]

  const filteredExperiences = experiences.filter((exp) => exp.type === mode)

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div
        className={`absolute inset-0 bg-gradient-to-b ${mode === "backend"
          ? "from-zinc-100/5 via-transparent to-zinc-400/5"
          : "from-zinc-400/5 via-transparent to-zinc-700/5"
          }`}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className="text-5xl md:text-7xl font-bold mb-4 text-foreground"
          >
            {mode === "backend" ? "Backend Journey" : "Web3 Experience"}
          </h2>
          <p className="text-xl text-muted-foreground">
            {mode === "backend"
              ? "Building robust systems and scalable infrastructure"
              : "Pioneering decentralized applications and blockchain solutions"}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary to-primary/50"
            style={{
              boxShadow: "0 0 15px rgba(var(--mode-glow), 0.3)",
            }}
          />

          {/* Experience Cards */}
          {filteredExperiences.map((exp, index) => (
            <div
              key={index}
              className={`relative mb-16 md:mb-24 ${index % 2 === 0 ? "md:pr-[calc(50%+3rem)]" : "md:pl-[calc(50%+3rem)] md:text-right"
                }`}
              style={{
                animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`,
              }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-0 md:left-1/2 top-8 w-6 h-6 rounded-full -ml-3 bg-primary border-4 border-background"
                style={{
                  boxShadow: "0 0 15px rgba(var(--mode-glow), 0.5)",
                }}
              />

              {/* Card */}
              <div className="glass-card p-8 rounded-2xl group hover:scale-105 transition-all duration-500 ml-8 md:ml-0">
                {/* Company & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="p-3 rounded-xl bg-zinc-200/20 text-foreground"
                  >
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-1">{exp.title}</h3>
                    <p className="text-lg font-semibold text-zinc-400">
                      {exp.company}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {exp.period}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {exp.location}
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground/80 mb-4 leading-relaxed">{exp.description}</p>

                {/* Achievements */}
                <div className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400"
                        style={{
                          boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)",
                        }}
                      />
                      <p className="text-sm text-foreground/70">{achievement}</p>
                    </div>
                  ))}
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
    </section>
  )
}
