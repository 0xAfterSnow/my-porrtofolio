"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Reveal, Section } from "@/components/section"

interface TestimonialsProps {
  mode: "backend" | "web3"
}

const testimonials = [
  {
    name: "Saviour Ukobong",
    role: "CEO, Asterverse",
    image: "/saviour.png",
    content:
      "Working with Shagbaor Agber has been an outstanding experience. He is a highly skilled backend developer who brings clarity, structure, and innovation to every project. His expertise in Python and Django consistently results in clean, scalable solutions that solve real problems. What sets Shagbaor apart is not just his technical ability, but also his work ethic and commitment to excellence. He communicates clearly, delivers on time, and often goes the extra mile to ensure that the final product exceeds expectations. Shagbaor is a dependable teammate and a problem solver at heart. I would confidently recommend him for any development project that values quality, reliability, and impact.",
    relevant: "backend",
  },
  {
    name: "John Okeke",
    role: "Founder, Sandlip Oasis",
    image: "/john.png",
    content:
      "Working with Shagbaor is the dream of every company; he personalises the job and internalises the requirements down to the smallest detail. Very patient, soft spoken and doesn't stress you over. His primary focus is to deliver excellence.",
    relevant: "web3",
  },
]

export function Testimonials({ mode }: TestimonialsProps) {
  const filtered = testimonials.filter((t) => t.relevant === mode)
  if (filtered.length === 0) return null

  return (
    <Section id="testimonials" label="Kind words" title="From people I've built with">
      <div className="space-y-16 md:pl-[25%]">
        {filtered.map((t) => (
          <Reveal key={t.name}>
            <figure className="max-w-[760px]">
              <blockquote
                className={cn(
                  "font-medium tracking-tight",
                  t.content.length > 320 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl",
                )}
              >
                <p>&ldquo;{t.content}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <Image
                  src={t.image}
                  alt={`Portrait of ${t.name}`}
                  width={48}
                  height={48}
                  className="size-12 rounded-xl object-cover"
                />
                <div>
                  <p className="text-base font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
