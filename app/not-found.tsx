import Link from "next/link"

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[100dvh] items-center px-6">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-hero mt-4 max-w-[680px] text-5xl font-semibold tracking-tighter md:text-6xl">
          This page doesn't exist
        </h1>
        <p className="mt-6 max-w-[560px] text-lg text-muted-foreground">
          The link may be old, or the page may have moved. The portfolio and the blog are both a click away.
        </p>
        <div className="mt-10 flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-foreground px-3 py-2 text-base font-semibold text-background transition-[transform,background-color] duration-300 ease-soft hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
          >
            Back to the portfolio
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center rounded-lg px-3 py-2 text-base font-semibold transition-[transform,background-color] duration-300 ease-soft hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </main>
  )
}
