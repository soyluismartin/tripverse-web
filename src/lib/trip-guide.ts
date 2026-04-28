/**
 * Helpers para alinear datos JSON del backend con TripGuideModels.swift (Tripverse).
 */

export type NormalizedTransport = {
  mode: string
  operator?: string
  duration?: string
  estimatedCost?: number
  via?: string
}

/** TransportConnection Swift (type, operatorName, price, via) o legacy web (mode, operator, estimatedCost). */
export function normalizeTransport(raw: unknown): NormalizedTransport | undefined {
  if (!raw || typeof raw !== 'object') return undefined

  const r = raw as Record<string, unknown>
  const typeRaw = (r.type ?? r.mode ?? 'flight') as string
  const mode = typeof typeRaw === 'string' ? typeRaw.toLowerCase() : 'flight'
  const operatorName = (r.operatorName ?? r.operator) as string | undefined
  const duration = r.duration as string | undefined
  const priceRaw = r.price ?? r.estimatedCost
  const estimatedCost = typeof priceRaw === 'number' ? priceRaw : undefined
  const via = typeof r.via === 'string' ? r.via : undefined

  return {
    mode,
    operator: operatorName,
    duration,
    estimatedCost,
    via,
  }
}

export type Versioned<T> = { versions?: T[] }

/**
 * Igual que antes `getFirstVersion`: admite `{ versions: [...] }`, un array plano,
 * u objeto único sin `versions` (datos legacy en Supabase).
 */
export function versionsArray<T extends { label?: string }>(wrapper: unknown): T[] | null {
  if (wrapper == null) return null

  if (Array.isArray(wrapper)) {
    return wrapper.length > 0 ? (wrapper as T[]) : null
  }

  if (typeof wrapper !== 'object') return null

  const objectWrapper = wrapper as { versions?: unknown }

  if (Array.isArray(objectWrapper.versions)) {
    return objectWrapper.versions.length > 0 ? (objectWrapper.versions as T[]) : null
  }

  return [wrapper as T]
}

export function listVersionLabels(routeData: unknown): string[] {
  const versions = versionsArray<{ label?: string }>(routeData)
  if (!versions?.length) return []

  return versions
    .map(version => version?.label)
    .filter((label): label is string => typeof label === 'string' && label.length > 0)
}

export function pickVersion<T extends { label?: string }>(
  wrapper: unknown,
  requested: string | undefined,
): T | null {
  const versions = versionsArray<T>(wrapper)
  if (!versions?.length) return null

  if (!requested?.trim()) return versions[0] ?? null

  const want = requested.trim().toLowerCase()
  const match = versions.find(version => (version.label ?? '').toLowerCase() === want)

  return match ?? versions[0] ?? null
}

export function normalizeCityCostRow(raw: Record<string, unknown>) {
  const days = Number(raw.days) || 0
  const accPer = Number(raw.accommodationPerNight ?? raw.accommodationPerDay ?? 0)
  const foodPer = Number(raw.foodPerDay ?? 0)
  const actPer = Number(raw.activitiesPerDay ?? 0)

  const accommodationTotal =
    typeof raw.accommodationTotal === 'number'
      ? raw.accommodationTotal
      : Math.round(accPer * Math.max(days, 1))
  const foodTotal =
    typeof raw.foodTotal === 'number' ? raw.foodTotal : Math.round(foodPer * Math.max(days, 1))
  const activitiesTotal =
    typeof raw.activitiesTotal === 'number'
      ? raw.activitiesTotal
      : Math.round(actPer * Math.max(days, 1))

  const total =
    typeof raw.cityTotal === 'number'
      ? raw.cityTotal
      : typeof raw.total === 'number'
        ? raw.total
        : accommodationTotal + foodTotal + activitiesTotal

  return {
    city: raw.city as string | undefined,
    flag: raw.flag as string | undefined,
    country: raw.country as string | undefined,
    days,
    accommodationPerNight: accPer,
    foodPerDay: foodPer,
    activitiesPerDay: actPer,
    accommodationTotal,
    foodTotal,
    activitiesTotal,
    total,
    note: typeof raw.note === 'string' ? raw.note : undefined,
  }
}

export function normalizeTotals(raw: Record<string, unknown> | undefined) {
  if (!raw || typeof raw !== 'object') {
    return {
      transport: 0,
      accommodation: 0,
      food: 0,
      activities: 0,
      grandTotal: 0,
      budgetNote: undefined as string | undefined,
    }
  }

  return {
    transport: Number(raw.transport) || 0,
    accommodation: Number(raw.accommodation) || 0,
    food: Number(raw.food) || 0,
    activities: Number(raw.activities) || 0,
    grandTotal: Number(raw.grandTotal) || 0,
    budgetNote: typeof raw.budgetNote === 'string' ? raw.budgetNote : undefined,
  }
}
