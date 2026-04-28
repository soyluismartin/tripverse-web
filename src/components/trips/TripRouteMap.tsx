'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export type TripRouteMapSegment = {
  city?: string
  country?: string
  flag?: string
  days?: number
}

type GeoEnriched = {
  segment: TripRouteMapSegment
  lon: number
  lat: number
}

function buildQuery(segment: TripRouteMapSegment): string | null {
  const city = segment.city?.trim()
  const country = segment.country?.trim()
  if (!city) return null
  return country ? `${city}, ${country}` : city
}

type GeocodeRow = { lat: number; lon: number; ok: boolean }

/** Fallback si `/api/geocode-batch` falla o devuelve todo vacío — Photon permite CORS desde el navegador. */
async function geocodePhotonBrowser(queries: string[]): Promise<GeocodeRow[]> {
  return Promise.all(
    queries.map(async query => {
      const trimmed = query.trim()
      if (!trimmed) return { lat: NaN, lon: NaN, ok: false }
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=1&lang=en`
        const res = await fetch(url, { headers: { Accept: 'application/json' } })
        if (!res.ok) return { lat: NaN, lon: NaN, ok: false }
        const data = (await res.json()) as {
          features?: { geometry?: { coordinates?: number[] } }[]
        }
        const coords = data.features?.[0]?.geometry?.coordinates
        if (!Array.isArray(coords) || coords.length < 2) return { lat: NaN, lon: NaN, ok: false }
        const [lon, lat] = coords
        const ok = Number.isFinite(lat) && Number.isFinite(lon)
        return { lat: ok ? lat : NaN, lon: ok ? lon : NaN, ok }
      } catch {
        return { lat: NaN, lon: NaN, ok: false }
      }
    }),
  )
}

function enrichFromRows(
  pairs: { segment: TripRouteMapSegment; query: string }[],
  rows: GeocodeRow[],
): GeoEnriched[] {
  const out: GeoEnriched[] = []
  pairs.forEach((pair, index) => {
    const row = rows[index]
    if (!row?.ok || !Number.isFinite(row.lat) || !Number.isFinite(row.lon)) return
    out.push({ lon: row.lon, segment: pair.segment, lat: row.lat })
  })
  return out
}

/** Estilo claro, sin POI — cercano a MapKit `.standard`. */
const MAP_STYLE_URL = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

function createAirportIcon(): HTMLElement {
  const wrap = document.createElement('div')
  wrap.className = 'trip-route-pin trip-route-pin--airport'
  wrap.innerHTML = `
    <div class="trip-route-pin-circle trip-route-pin-circle--airport" aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16v-2l-8-5V4.5c0-.83-.67-1.5-1.5-1.5S10 3.67 10 4.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#ffffff"/>
      </svg>
    </div>
  `
  return wrap
}

function createDestinationIcon(flag: string): HTMLElement {
  const wrap = document.createElement('div')
  wrap.className = 'trip-route-pin trip-route-pin--dest'
  wrap.innerHTML = `
    <div class="trip-route-pin-circle trip-route-pin-circle--dest" aria-hidden="true">
      <span class="trip-route-pin-flag">${flag || '📍'}</span>
    </div>
  `
  return wrap
}

function addLabel(wrap: HTMLElement, cityName: string) {
  const label = document.createElement('div')
  label.className = 'trip-route-pin-label'
  label.textContent = cityName || ''
  wrap.appendChild(label)
}

export default function TripRouteMap({ segments }: { segments: TripRouteMapSegment[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null)

  useEffect(() => {
    const queries = segments.map(buildQuery).filter((q): q is string => Boolean(q))

    if (queries.length === 0) {
      setStatus('fallback')
      setFallbackMessage('No route segments with a city name.')
      return
    }

    let cancelled = false

    setStatus('loading')
    setFallbackMessage(null)

    ;(async () => {
      try {
        const pairs: { segment: TripRouteMapSegment; query: string }[] = []
        segments.forEach(segment => {
          const q = buildQuery(segment)
          if (q) pairs.push({ query: q, segment })
        })

        let serverRows: GeocodeRow[] = []
        try {
          const res = await fetch('/api/geocode-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ queries }),
          })
          if (res.ok) {
            const data = (await res.json()) as { results?: GeocodeRow[] }
            serverRows = data.results ?? []
          }
        } catch {
          serverRows = []
        }

        let enriched = enrichFromRows(pairs, serverRows)

        if (enriched.length === 0 && pairs.length > 0) {
          enriched = enrichFromRows(pairs, await geocodePhotonBrowser(queries))
        }

        if (cancelled) return

        if (enriched.length === 0) {
          setStatus('fallback')
          setFallbackMessage(
            'Could not geocode route stops. Try again later — or open the Tripverse app for the full interactive map.',
          )
          return
        }

        const coords: [number, number][] = enriched.map(e => [e.lon, e.lat])

        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

        if (cancelled || !containerRef.current) {
          setStatus('fallback')
          setFallbackMessage('Map container not available.')
          return
        }

        const map = new maplibregl.Map({
          boxZoom: false,
          container: containerRef.current,
          dragRotate: false,
          interactive: false,
          maxZoom: 12,
          pitchWithRotate: false,
          style: MAP_STYLE_URL,
          touchZoomRotate: false,
        })

        map.dragPan.disable()
        map.scrollZoom.disable()
        map.doubleClickZoom.disable()
        map.keyboard.disable()
        map.touchZoomRotate.disable()

        mapRef.current = map

        map.once('load', () => {
          if (cancelled) return

          map.addSource('trip-route-line', {
            data: {
              geometry: {
                coordinates: coords,
                type: 'LineString',
              },
              properties: {},
              type: 'Feature',
            },
            type: 'geojson',
          })

          map.addLayer({
            id: 'trip-route-line-layer',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#0a0a0a',
              'line-dasharray': [3, 2],
              'line-opacity': 0.35,
              'line-width': 1.5,
            },
            source: 'trip-route-line',
            type: 'line',
          })

          enriched.forEach(({ segment, lon, lat }) => {
            const name = segment.city ?? ''
            const isAirport = (segment.days ?? 0) === 0
            const root = isAirport ? createAirportIcon() : createDestinationIcon(segment.flag ?? '')
            addLabel(root, name)

            const marker = new maplibregl.Marker({ anchor: 'bottom', element: root }).setLngLat([lon, lat]).addTo(map)

            markersRef.current.push(marker)
          })

          const bounds = new maplibregl.LngLatBounds(coords[0], coords[0])
          coords.forEach(c => bounds.extend(c))
          map.fitBounds(bounds, { duration: 0, maxZoom: 10, padding: 52 })

          setStatus('ready')
        })

        map.on('error', () => {
          if (!cancelled) {
            setStatus('fallback')
            setFallbackMessage('Could not load the map tiles.')
          }
        })
      } catch (err) {
        if (!cancelled) {
          setStatus('fallback')
          setFallbackMessage(err instanceof Error ? err.message : 'Could not load the route map.')
        }
      }
    })()

    return () => {
      cancelled = true
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [segments])

  if (segments.length === 0) {
    return <p className="trip-detail-map-fallback">No route segments to display.</p>
  }

  return (
    <div className="trip-route-map-root">
      <div className="trip-route-map-shell">
        <div className="trip-route-map-canvas-wrap">
          <div className="trip-route-map-canvas" ref={containerRef} />
          {status === 'loading' ? (
            <div aria-live="polite" className="trip-route-map-loading trip-route-map-loading--overlay">
              <span className="trip-route-map-spinner" />
              <span className="trip-route-map-loading-text">Loading map…</span>
            </div>
          ) : null}
          {status === 'fallback' ? (
            <div className="trip-route-map-loading trip-route-map-loading--overlay">
              <p className="trip-detail-map-fallback trip-detail-map-fallback--in-map">
                {fallbackMessage ??
                  'Could not show the map. Open the Tripverse app on iOS for the full interactive route.'}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      {status === 'ready' ? (
        <p className="trip-route-map-attribution-note">Map data © OpenStreetMap · © CARTO</p>
      ) : null}
    </div>
  )
}
