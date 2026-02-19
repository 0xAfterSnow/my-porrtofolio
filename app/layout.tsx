import type React from "react"
import type { Metadata } from "next"
import { Chakra_Petch } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const chakraPetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra-petch",
})

import { getSiteSettings } from "@/lib/get-settings"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const title = settings?.site_title || "Shagbaor Agber | Full-Stack Web3 Developer"
  const description = settings?.site_description || "Shagbaor Agber — Software Developer specializing in Django, Web3, and full-stack innovation. Building scalable digital systems merging blockchain utility with modern web infrastructure."
  const keywords = settings?.seo_keywords || ["Software Developer", "Web3", "Django", "Next.js", "Blockchain", "React", "TypeScript", "Full Stack"]
  const authorName = settings?.author_name || "Shagbaor Agber"
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shagbaor.is-a.dev/"
  const ogImage = settings?.og_image_url || "/og-image.png"

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${authorName}`,
    },
    description: description,
    keywords: keywords,
    authors: [{ name: authorName, url: siteUrl }],
    creator: authorName,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: title,
      description: description,
      siteName: settings?.site_title || "Shagbaor Agber Portfolio",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
      creator: settings?.social_twitter ? `@${settings.social_twitter.split('/').pop()}` : "@shagbaor",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`font-sans ${chakraPetch.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
