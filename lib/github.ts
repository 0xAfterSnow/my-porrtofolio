export const GITHUB_USERNAME = "0xAfterSnow"

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

export type Contributions = { total: number; year: number; days: ContributionDay[] }

const LEVELS: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

// Official GraphQL API; needs a GITHUB_TOKEN with read:user scope.
async function fromGraphQL(username: string, year: number, token: string): Promise<Contributions | null> {
  const query = `query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { login: username, from: `${year}-01-01T00:00:00Z`, to: `${year}-12-31T23:59:59Z` },
    }),
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  const json = await res.json()
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar) return null

  const days: ContributionDay[] = calendar.weeks.flatMap((week: any) =>
    week.contributionDays.map((d: any) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVELS[d.contributionLevel] ?? 0,
    })),
  )
  return { total: calendar.totalContributions, year, days }
}

// Public, keyless fallback (the API behind react-github-calendar).
async function fromPublicApi(username: string, year: number): Promise<Contributions | null> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  const json = await res.json()
  if (!Array.isArray(json?.contributions)) return null
  return { total: json.total?.[year] ?? 0, year, days: json.contributions }
}

export async function getContributions(username: string): Promise<Contributions | null> {
  const year = new Date().getFullYear()
  const today = new Date().toISOString().slice(0, 10)
  try {
    const token = process.env.GITHUB_TOKEN
    const data = (token && (await fromGraphQL(username, year, token))) || (await fromPublicApi(username, year))
    if (!data) return null
    // Drop future days so the graph ends at today, decided once on the server.
    return { ...data, days: data.days.filter((d) => d.date <= today) }
  } catch {
    return null
  }
}
