import { getPublicTrips, getPublicTripsCount } from '@/lib/trips'

export default async function sitemap() {
  const count = await getPublicTripsCount()
  const pages = Math.ceil(count / 100)
  const allTrips: any[] = []

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

  return [
    { url: 'https://tripverse.app', priority: 1.0, changeFrequency: 'monthly' as const },
    { url: 'https://tripverse.app/trips', priority: 0.9, changeFrequency: 'daily' as const },
    ...tripUrls,
  ]
}
