"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import type { ContributionDay, Contributions } from "@/lib/github"

// Weeks shown on phones, where a full year would make the squares too small.
const MOBILE_WEEKS = 22
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

type Cell = ContributionDay | null

// Columns are weeks (Sunday first); days outside the year render as blanks.
function buildWeeks(days: ContributionDay[], year: number) {
  const byDate = new Map(days.map((d) => [d.date, d]))
  const last = days.length ? days[days.length - 1].date : `${year}-12-31`
  const end = new Date(`${last}T00:00:00Z`)
  const cursor = new Date(Date.UTC(year, 0, 1))
  cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay())

  const weeks: Cell[][] = []
  const labels: { index: number; month: string }[] = []

  while (cursor <= end) {
    const week: Cell[] = []
    for (let i = 0; i < 7; i++) {
      const iso = cursor.toISOString().slice(0, 10)
      const inRange = cursor.getUTCFullYear() === year && cursor <= end
      week.push(inRange ? (byDate.get(iso) ?? { date: iso, count: 0, level: 0 }) : null)
      if (inRange && cursor.getUTCDate() === 1) {
        labels.push({ index: weeks.length, month: MONTHS[cursor.getUTCMonth()] })
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    weeks.push(week)
  }
  return { weeks, labels }
}

const dateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

export function ContributionGraph({ data, username }: { data: Contributions | null; username: string }) {
  const graph = useMemo(() => (data ? buildWeeks(data.days, data.year) : null), [data])

  if (!data || !graph) {
    return (
      <div className="flex min-h-40 flex-col items-start justify-center gap-2 p-4">
        <p className="text-sm font-medium">Contribution graph is taking a break</p>
        <p className="text-sm text-muted-foreground">
          GitHub didn't answer this time. The full history is on{" "}
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            my profile
          </a>
          .
        </p>
      </div>
    )
  }

  const columns = graph.weeks.length
  const offset = Math.max(0, columns - MOBILE_WEEKS)
  const mobileColumns = columns - offset

  return (
    <figure className="p-4">
      {/* Squares scale with the card, so the whole year fits without scrolling. */}
      <div aria-hidden className="relative h-5 text-xs text-foreground/90 sm:text-sm">
        {graph.labels.map(({ index, month }) => (
          <span
            key={month}
            className={cn("absolute top-0 left-[var(--x-sm)] sm:left-[var(--x)]", index < offset && "max-sm:hidden")}
            style={
              {
                "--x": `${(index / columns) * 100}%`,
                "--x-sm": `${((index - offset) / mobileColumns) * 100}%`,
              } as React.CSSProperties
            }
          >
            {month}
          </span>
        ))}
      </div>
      <div
        role="img"
        aria-label={`${data.total} GitHub contributions in ${data.year}`}
        className="mt-2 grid grid-flow-col grid-rows-7 gap-[3px] [grid-template-columns:repeat(var(--cols-sm),minmax(0,1fr))] sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
        style={{ "--cols": columns, "--cols-sm": mobileColumns } as React.CSSProperties}
      >
        {graph.weeks.flatMap((week, w) =>
          week.map((day, d) =>
            day ? (
              <span
                key={`${w}-${d}`}
                className={cn("aspect-square rounded-[2px]", w < offset && "max-sm:hidden")}
                title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${dateLabel(day.date)}`}
                style={{ background: `var(--contrib-${day.level})` }}
              />
            ) : (
              <span key={`${w}-${d}`} className={cn("aspect-square", w < offset && "max-sm:hidden")} />
            ),
          ),
        )}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span className="tabular-nums">
          {data.total.toLocaleString("en-US")} contributions in {data.year}
        </span>
        <span aria-hidden className="flex items-center gap-1">
          Less
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className="size-[11px] rounded-[2px]"
              style={{ background: `var(--contrib-${level})` }}
            />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  )
}
