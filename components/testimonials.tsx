"use client"

import { Card } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

interface TestimonialsProps {
  mode: "backend" | "web3"
}

export function Testimonials({ mode }: TestimonialsProps) {
  const testimonials = [
    {
      name: "Saviour Ukobong",
      role: "CEO Asterverse",
      image: "/saviour.png",
      content:
        "Working with Shagbaor Agber has been an outstanding experience. He is a highly skilled backend developer who brings clarity, structure, and innovation to every project. His expertise in Python and Django consistently results in clean, scalable solutions that solve real problems What sets Shagbaor apart is not just his technical ability, but also his work ethic and commitment to excellence. He communicates clearly, delivers on time, and often goes the extra mile to ensure that the final product exceeds expectations. Shagbaor is a dependable teammate and a problem-solver at heart. I would confidently recommend him for any development project that values quality, reliability, and impact.",
      rating: 5,
      relevant: "backend",
    },
    {
      name: "John Okeke",
      role: "Founder Sandlip Oasis",
      image: "/john.png",
      content:
        "Working with Shagbaor is the dream of every company; he personalises the job and internalises the requirements down to the smallest detail. Very patient, soft spoken and doesn't stress you over. His primary focus is to deliver excellence.",
      rating: 5,
      relevant: "web3",
    },
  ]

  const filteredTestimonials = testimonials.filter((t) => t.relevant === mode)

  return (
    <section id="testimonials" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            What <span className="text-foreground">Clients Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted by startups and enterprises worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filteredTestimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-500 group hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <Quote className="h-10 w-10 text-foreground/30" />
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                    ))}
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-foreground/90">{testimonial.content}</p>

                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
