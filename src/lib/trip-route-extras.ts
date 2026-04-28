/**
 * Extrae campos opcionales del JSON de rutas / rationale / finance / meta (Tripverse app ↔ Supabase).
 * Incluye formas «secciones con título» (como la app iOS) y muchas variantes de claves.
 */

export function coerceString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export function extractTripNarrative(
  rationale: Record<string, unknown> | null | undefined,
  meta: unknown,
): string | undefined {
  const metaObj = meta && typeof meta === 'object' ? (meta as Record<string, unknown>) : {}
  return (
    coerceString(rationale?.tripNarrative) ??
    coerceString(rationale?.trip_narrative) ??
    coerceString(rationale?.narrative) ??
    coerceString(rationale?.tripNarrativeMarkdown) ??
    coerceString(metaObj.tripNarrative) ??
    coerceString(metaObj.narrative)
  )
}

export type FinanceExtras = {
  strategicSummary?: string
  documents: string[]
  safety: string[]
  payments: string[]
  checklistLines: string[]
}

function mergeUnique(...lists: string[][]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const list of lists) {
    for (const line of list) {
      const key = line.trim()
      if (!key || seen.has(key)) continue
      seen.add(key)
      out.push(line)
    }
  }
  return out
}

function toLines(value: unknown): string[] {
  if (value == null) return []
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === 'string') return item.trim()
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>
          const a = coerceString(o.title ?? o.label ?? o.name ?? o.heading)
          const b = coerceString(o.detail ?? o.description ?? o.body ?? o.text ?? o.content)
          if (a && b) return `${a}: ${b}`
          return a ?? b ?? ''
        }
        return ''
      })
      .filter(Boolean) as string[]
  }
  if (typeof value === 'string') return value.trim() ? [value.trim()] : []
  return []
}

/** Lista numerada / checklist: admite strings u objetos `{ text, body }`. */
function normalizeChecklistItems(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const lines: string[] = []
  raw.forEach((item, index) => {
    if (typeof item === 'string') {
      lines.push(`${index + 1}. ${item.trim()}`)
      return
    }
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>
      const text =
        coerceString(o.text ?? o.body ?? o.description ?? o.title ?? o.detail ?? o.line) ??
        (typeof o.content === 'string' ? o.content.trim() : '')
      if (text) lines.push(`${index + 1}. ${text}`)
    }
  })
  return lines
}

/** Interpreta bloques `{ title, items[] }` como en Trip Guide iOS. */
function extractFromSections(root: Record<string, unknown>): {
  documents: string[]
  safety: string[]
  payments: string[]
  checklistLines: string[]
} {
  const buckets = {
    documents: [] as string[],
    safety: [] as string[],
    payments: [] as string[],
    checklistLines: [] as string[],
  }

  const rawSections =
    root.sections ??
    root.contentSections ??
    root.financeSections ??
    root.blocks ??
    root.tripGuideSections ??
    root.guideSections

  if (!Array.isArray(rawSections)) return buckets

  for (const sec of rawSections) {
    if (!sec || typeof sec !== 'object') continue
    const s = sec as Record<string, unknown>
    const titleRaw = coerceString(s.title ?? s.name ?? s.sectionTitle ?? s.heading ?? s.kind ?? s.type) ?? ''
    const title = titleRaw.toLowerCase()
    const items = s.items ?? s.bullets ?? s.lines ?? s.points ?? s.entries ?? s.list
    const body = coerceString(s.body ?? s.text ?? s.markdown ?? s.narrative)
    const lineBlock = mergeUnique(toLines(items), body ? [body] : [])

    if (title.includes('payment') || title.includes('currency') || title === 'payments') {
      buckets.payments.push(...lineBlock)
    } else if (title.includes('document') || title.includes('visa') || title.includes('passport')) {
      buckets.documents.push(...lineBlock)
    } else if (title.includes('safety') || title.includes('security') || title.includes('health')) {
      buckets.safety.push(...lineBlock)
    } else if (title.includes('checklist') || title.includes('final') || title.includes('pre-trip')) {
      buckets.checklistLines.push(...normalizeChecklistItems(items))
    }
  }

  return buckets
}

function firstStr(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = coerceString(obj[k])
    if (v) return v
  }
  return undefined
}

function gatherFromKeyAliases(obj: Record<string, unknown>, aliases: string[]): string[] {
  const acc: string[] = []
  for (const key of aliases) {
    const raw = obj[key]
    if (raw != null) acc.push(...toLines(raw))
  }
  return mergeUnique(acc, [])
}

const DOC_KEYS = [
  'documents',
  'documentChecklist',
  'document_checklist',
  'documentTips',
  'document_tips',
  'visaDocuments',
  'travelDocuments',
]

const SAFETY_KEYS = [
  'safety',
  'safetyTips',
  'safety_tips',
  'healthAndSafety',
  'health_and_safety',
  'securityTips',
  'riskNotes',
]

const PAY_KEYS = [
  'payments',
  'paymentTips',
  'payment_tips',
  'paymentMethods',
  'payment_methods',
  'paymentGuidance',
  'payment_guidance',
  'paymentAdvice',
  'paymentBullets',
  'payment_bullets',
  'currencyGuidance',
  'currencyTips',
  'moneyTips',
  'financialTips',
]

const CHECKLIST_KEYS = [
  'checklist',
  'numberedChecklist',
  'numbered_checklist',
  'finalChecklist',
  'final_checklist',
  'preTripChecklist',
  'pre_trip_checklist',
  'checklistItems',
  'checklist_items',
  'tripChecklist',
]

const STRATEGIC_KEYS = ['strategicSummary', 'strategic_summary', 'travelStrategy', 'travel_strategy', 'financeSummary']

function tryNestedBulletBlock(obj: Record<string, unknown>, containerKey: string): string[] {
  const c = obj[containerKey]
  if (!c || typeof c !== 'object' || Array.isArray(c)) return []
  const o = c as Record<string, unknown>
  return toLines(o.bullets ?? o.items ?? o.lines ?? o.points)
}

function collectFromObject(obj: Record<string, unknown>): FinanceExtras {
  const fromSections = extractFromSections(obj)

  const strategicSummary = firstStr(obj, STRATEGIC_KEYS)

  const documents = mergeUnique(
    gatherFromKeyAliases(obj, DOC_KEYS),
    fromSections.documents,
    toLines(obj.documentNotes),
    tryNestedBulletBlock(obj, 'documents'),
    tryNestedBulletBlock(obj, 'documentSection'),
  )

  const safety = mergeUnique(
    gatherFromKeyAliases(obj, SAFETY_KEYS),
    fromSections.safety,
    tryNestedBulletBlock(obj, 'safety'),
  )

  const payments = mergeUnique(
    gatherFromKeyAliases(obj, PAY_KEYS),
    fromSections.payments,
    toLines(obj.currenciesNote),
    tryNestedBulletBlock(obj, 'payments'),
  )

  let checklistLines = mergeUnique(fromSections.checklistLines, [])
  for (const key of CHECKLIST_KEYS) {
    const raw = obj[key]
    if (raw == null) continue
    if (Array.isArray(raw)) {
      checklistLines = mergeUnique(checklistLines, normalizeChecklistItems(raw))
    } else if (typeof raw === 'string') {
      const lines = raw
        .split(/\n+/)
        .map(l => l.trim())
        .filter(Boolean)
      checklistLines = mergeUnique(checklistLines, normalizeChecklistItems(lines))
    }
  }

  return {
    strategicSummary,
    documents,
    safety,
    payments,
    checklistLines,
  }
}

function mergeFinance(a: FinanceExtras, b: Partial<FinanceExtras>): FinanceExtras {
  return {
    strategicSummary: a.strategicSummary ?? b.strategicSummary,
    documents: mergeUnique(a.documents ?? [], b.documents ?? []),
    safety: mergeUnique(a.safety ?? [], b.safety ?? []),
    payments: mergeUnique(a.payments ?? [], b.payments ?? []),
    checklistLines: mergeUnique(a.checklistLines ?? [], b.checklistLines ?? []),
  }
}

const NEST_FINANCE_KEYS = ['financeGuide', 'finance', 'tripFinance', 'guide', 'financePayload', 'tripGuideFinance']

/**
 * Une `finance_data` y, si existe, sub-objetos anidados + `meta_data` relacionado con finanzas.
 */
export function normalizeFinanceExtras(
  version: Record<string, unknown> | null | undefined,
  meta?: unknown,
): FinanceExtras {
  const empty: FinanceExtras = {
    documents: [],
    safety: [],
    payments: [],
    checklistLines: [],
  }

  if (!version || typeof version !== 'object') {
    if (meta && typeof meta === 'object') return extractMetaFinance(meta as Record<string, unknown>)
    return empty
  }

  let result = collectFromObject(version)

  for (const key of NEST_FINANCE_KEYS) {
    const nested = version[key]
    if (nested && typeof nested === 'object') {
      result = mergeFinance(result, collectFromObject(nested as Record<string, unknown>))
    }
  }

  if (meta && typeof meta === 'object') {
    result = mergeFinance(result, extractMetaFinance(meta as Record<string, unknown>))
  }

  return result
}

function extractMetaFinance(meta: Record<string, unknown>): FinanceExtras {
  const initial: FinanceExtras = {
    documents: [],
    safety: [],
    payments: [],
    checklistLines: [],
  }
  let result = initial
  for (const key of NEST_FINANCE_KEYS) {
    const nested = meta[key]
    if (nested && typeof nested === 'object') {
      result = mergeFinance(result, collectFromObject(nested as Record<string, unknown>))
    }
  }
  return result
}

/** Coordenadas para mapa estático / enlace (si vienen en meta). */
export type RouteMapHint = {
  centerLat?: number
  centerLng?: number
  cityCenters?: { city?: string; lat?: number; lng?: number }[]
}

export function extractRouteMapHint(meta: unknown): RouteMapHint | null {
  if (!meta || typeof meta !== 'object') return null
  const m = meta as Record<string, unknown>
  const lat = Number(m.centerLat ?? m.center_lat ?? m.lat)
  const lng = Number(m.centerLng ?? m.center_lng ?? m.lng)
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { centerLat: lat, centerLng: lng }
  }
  const centers = m.cityCenters ?? m.city_centers
  if (Array.isArray(centers) && centers.length > 0) {
    const parsed = centers
      .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
      .map(c => ({
        city: coerceString(c.city),
        lat: Number(c.lat ?? c.latitude),
        lng: Number(c.lng ?? c.longitude),
      }))
      .filter(c => Number.isFinite(c.lat) && Number.isFinite(c.lng))
    if (parsed.length > 0) return { cityCenters: parsed }
  }
  return null
}
