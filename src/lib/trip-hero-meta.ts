/**
 * Chips del hero del viaje — alineados con TripGuideView / TripMeta en iOS:
 * style tags desde trip.tags ∪ meta.tripTags; meta chips desde meta + ruta activa.
 */

export type HeroMetaChipIconKind =
  | 'travelers'
  | 'pets'
  | 'pace'
  | 'calendar'
  | 'destinations'
  | 'budget'

export type HeroMetaChip = {
  icon: HeroMetaChipIconKind
  key: string
  label: string
}

function coerceMetaString(meta: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = meta[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return undefined
}

function coerceMetaBool(meta: Record<string, unknown>, ...keys: string[]): boolean {
  for (const k of keys) {
    const v = meta[k]
    if (v === true) return true
    if (v === 'true') return true
    if (v === 1) return true
  }
  return false
}

/** Une tags del trip en PostgreSQL con ids guardados en route.meta_data.tripTags (Gemini / classifyStyle). */
export function mergeStyleTagIds(tags: unknown, meta: unknown): string[] {
  const set = new Set<string>()
  if (Array.isArray(tags)) {
    tags.forEach(t => {
      if (typeof t === 'string' && t.trim()) set.add(t.trim())
    })
  }
  const m = meta && typeof meta === 'object' ? (meta as Record<string, unknown>) : {}
  const raw = m.tripTags ?? m.trip_tags ?? m.styleTags
  if (Array.isArray(raw)) {
    raw.forEach(t => {
      if (typeof t === 'string' && t.trim()) set.add(t.trim())
    })
  }
  return [...set]
}

function deriveTravelersLabel(travelersRaw: string): string {
  const t = travelersRaw.trim().toLowerCase()
  if (!t) return ''
  if (t.includes('solo')) return 'Solo trip'
  if (t.includes('couple')) return 'Couples'
  if (t.includes('group_small') || (t.includes('family') && !t.includes('friend'))) return 'Family'
  if (t.includes('group_large') || t.includes('friend')) return 'Friends'
  return travelersRaw.trim()
}

function paceDisplayLabel(raw: string): string {
  const p = raw.trim().toLowerCase()
  if (!p) return ''
  if (p.includes('relax')) return 'Relaxed'
  if (p.includes('moderate')) return 'Moderate'
  if (p.includes('fast')) return 'Fast-paced'
  return raw.trim()
}

export function buildHeroMetaChips(args: {
  grandTotal?: number
  meta: unknown
  segments: Array<{ days?: number }>
  trip: { travelers: string; trip_pace: string }
}): HeroMetaChip[] {
  const m = args.meta && typeof args.meta === 'object' ? (args.meta as Record<string, unknown>) : {}
  const chips: HeroMetaChip[] = []

  const travelersLabel =
    coerceMetaString(m, 'travelersLabel', 'travelers_label') ?? deriveTravelersLabel(args.trip.travelers ?? '')
  if (travelersLabel) {
    chips.push({ key: 'travelers', label: travelersLabel, icon: 'travelers' })
  }

  if (coerceMetaBool(m, 'withPets', 'with_pets')) {
    chips.push({ key: 'pets', label: 'Pet-friendly', icon: 'pets' })
  }

  const paceRaw = coerceMetaString(m, 'tripPace', 'trip_pace') ?? args.trip.trip_pace ?? ''
  const paceLabel = paceDisplayLabel(paceRaw)
  if (paceLabel) {
    chips.push({ key: 'pace', label: paceLabel, icon: 'pace' })
  }

  const totalDays = args.segments.reduce((sum, seg) => sum + Math.max(0, seg.days ?? 0), 0)
  if (totalDays > 0) {
    chips.push({
      key: 'days',
      label: `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`,
      icon: 'calendar',
    })
  }

  const destCount = args.segments.filter(seg => (seg.days ?? 0) > 0).length
  if (destCount > 0) {
    chips.push({
      key: 'dest',
      label: `${destCount} ${destCount === 1 ? 'destination' : 'destinations'}`,
      icon: 'destinations',
    })
  }

  const gt = args.grandTotal
  if (gt != null && Number.isFinite(gt) && gt > 0) {
    chips.push({
      key: 'cost',
      label: `~$${Math.round(gt).toLocaleString('en-US')}/person`,
      icon: 'budget',
    })
  }

  return chips
}
