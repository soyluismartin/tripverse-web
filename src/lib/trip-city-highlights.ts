/**
 * Matches `cityHighlights` in Supabase `rationale_data` (see CSV exports / `routes_rows`).
 */

export type CityHighlight = {
  city?: string
  flag?: string
  tagline?: string
  mustSeeSpot?: string
}

export type TripGuideDestination = {
  city?: string
  country?: string
  flag?: string
  tagline?: string
  mustSeeSpot?: string
}

function normKey(s?: string) {
  return (s ?? '').trim().toLowerCase()
}

function readString(r: Record<string, unknown>, ...keys: string[]) {
  for (const k of keys) {
    const v = r[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return undefined
}

/** Normalizes raw JSON arrays (camelCase or snake_case keys). */
export function normalizeCityHighlights(input: unknown): CityHighlight[] {
  if (!Array.isArray(input)) return []
  const out: CityHighlight[] = []
  for (const item of input) {
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    const city = readString(r, 'city')
    if (!city) continue
    out.push({
      city,
      flag: readString(r, 'flag'),
      tagline: readString(r, 'tagline', 'tag_line'),
      mustSeeSpot: readString(r, 'mustSeeSpot', 'must_see_spot', 'mustSeeSpots'),
    })
  }
  return out
}

export function mergeDestinationWithHighlight(
  dest: TripGuideDestination,
  highlights?: CityHighlight[] | null
): TripGuideDestination {
  const key = normKey(dest.city)
  const h = highlights?.find(x => normKey(x.city) === key)
  if (!h) return { ...dest }
  return {
    ...dest,
    tagline: h.tagline || dest.tagline,
    mustSeeSpot: h.mustSeeSpot || dest.mustSeeSpot,
    flag: dest.flag ?? h.flag,
  }
}
