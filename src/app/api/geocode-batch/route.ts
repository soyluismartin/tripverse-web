import { NextResponse } from 'next/server'

export const maxDuration = 60

export type GeocodeResult = {
  lat: number
  lon: number
  ok: boolean
  query: string
}

type Body = {
  queries?: string[]
}

/**
 * Geocodificación por lotes:
 * 1) Photon (Komoot) — suele responder bien desde hosting; paralelo.
 * 2) Nominatim solo para ítems fallidos — ~1 req/s (política OSM).
 */
export async function POST(request: Request) {
  try {
    let body: Body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const queries = Array.isArray(body.queries)
      ? body.queries.filter((q): q is string => typeof q === 'string').slice(0, 40)
      : []

    if (queries.length === 0) {
      return NextResponse.json({ results: [] as GeocodeResult[] })
    }

    const results = await geocodePhotonParallel(queries)

    let nominatimCalls = 0
    for (let i = 0; i < results.length; i++) {
      if (results[i].ok) continue
      if (nominatimCalls > 0) {
        await delay(1100)
      }
      nominatimCalls += 1
      results[i] = await geocodeOneNominatim(queries[i])
    }

    return NextResponse.json({ results })
  } catch (err) {
    console.error('[api/geocode-batch]', err)
    throw err
  }
}

function delay(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms)
  })
}

async function geocodePhotonParallel(queries: string[]): Promise<GeocodeResult[]> {
  return Promise.all(
    queries.map(async query => {
      const trimmed = query.trim()
      if (!trimmed) return { query, lat: NaN, lon: NaN, ok: false }
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=1&lang=en`
        const res = await fetch(url, {
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        })
        if (!res.ok) return { query, lat: NaN, lon: NaN, ok: false }
        const data = (await res.json()) as {
          features?: { geometry?: { coordinates?: number[] } }[]
        }
        const coords = data.features?.[0]?.geometry?.coordinates
        if (!Array.isArray(coords) || coords.length < 2) {
          return { query, lat: NaN, lon: NaN, ok: false }
        }
        const [lon, lat] = coords
        const ok = Number.isFinite(lat) && Number.isFinite(lon)
        return { query, lat: ok ? lat : NaN, lon: ok ? lon : NaN, ok }
      } catch {
        return { query, lat: NaN, lon: NaN, ok: false }
      }
    }),
  )
}

async function geocodeOneNominatim(query: string): Promise<GeocodeResult> {
  const trimmed = query.trim()
  if (!trimmed) return { query, lat: NaN, lon: NaN, ok: false }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&limit=1`
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TripverseWeb/1.0 (public trip guides; contact: hello@tripverse.app)',
      },
    })
    if (!res.ok) return { query, lat: NaN, lon: NaN, ok: false }
    const data = (await res.json()) as { lat?: string; lon?: string }[]
    const row = Array.isArray(data) ? data[0] : undefined
    const lat = row?.lat != null ? Number.parseFloat(row.lat) : NaN
    const lon = row?.lon != null ? Number.parseFloat(row.lon) : NaN
    const ok = Number.isFinite(lat) && Number.isFinite(lon)
    return { query, lat: ok ? lat : NaN, lon: ok ? lon : NaN, ok }
  } catch {
    return { query, lat: NaN, lon: NaN, ok: false }
  }
}
