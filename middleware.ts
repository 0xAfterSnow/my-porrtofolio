import { updateSession } from "./lib/supabase/middleware"

export async function middleware(request: any) {
  return await updateSession(request)
}

export const config = {
  // Only the admin needs a session. Public pages skip the auth round trip entirely.
  matcher: ["/admin/:path*"],
}
