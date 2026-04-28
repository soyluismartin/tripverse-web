import { getPublicTrips, getPublicTripsCount } from '@/lib/trips'

/** URLs mínimas cuando no hay Supabase en CI (p. ej. Cloudflare Pages sin env todavía). */
const STATIC_ENTRIES = [
  { url: 'https://tripverse.app', priority: 1.0, changeFrequency: 'monthly' as const },
  { url: 'https://tripverse.app/trips', priority: 0.9, changeFrequency: 'daily' as const },
]

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  )
}

export default async function sitemap() {
  if (!hasSupabaseEnv()) {
    return STATIC_ENTRIES
  }

  try {
    const count = await getPublicTripsCount()
    const pages = Math.ceil(count / 100)
    const allTrips: Awaited<ReturnType<typeof getPublicTrips>> = []

    for (let i = 0; i < pages; i++) {
      const batch = await getPublicTrips(i, 100)
      allTrips.push(...batch)
    }

    const tripUrls = allTrips
      .filter(t => t.routes?.[0]?.slug)
      .map(t => ({
        url: `https://tripverse.app/trips/${t.routes[0].slug}`,
        lastModified: t.created_at,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))

    return [...STATIC_ENTRIES, ...tripUrls]
  } catch {
    return STATIC_ENTRIES
  }
}
