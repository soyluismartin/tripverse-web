export function formatTripMoney(value?: number) {
  return Math.round(value ?? 0).toLocaleString('en-US')
}

export function formatTravelWindow(tw: unknown): string | undefined {
  if (tw == null) return undefined
  if (typeof tw === 'string') return tw
  if (typeof tw === 'object') {
    const o = tw as Record<string, unknown>
    if (typeof o.label === 'string') return o.label
    const s = o.start ?? o.from
    const e = o.end ?? o.to
    if (typeof s === 'string' && typeof e === 'string') return `${s} – ${e}`
    if (typeof s === 'string') return s
  }
  return undefined
}

export function formatPreferences(p: unknown): string | undefined {
  if (p == null) return undefined
  if (typeof p === 'string') return p
  if (Array.isArray(p)) return p.filter(Boolean).join(', ')
  if (typeof p === 'object') {
    const o = p as Record<string, unknown>
    const keys = Object.keys(o).filter(k => Boolean(o[k]))
    if (keys.length) return keys.join(', ')
  }
  return undefined
}
