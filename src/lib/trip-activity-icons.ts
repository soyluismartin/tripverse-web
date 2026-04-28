/** Emoji por categoría normalizada (datos del backend + aliases). */
const activityIcons: Record<string, string> = {
  landmark: '🏛️',
  cultural: '🎭',
  museum: '🖼️',
  gallery: '🖼️',
  historic: '🏛️',
  outdoor: '🌳',
  nature: '🌿',
  park: '🌳',
  food: '🍽️',
  dining: '🍽️',
  nightlife: '🌙',
  shopping: '🛍️',
  market: '🛒',
  cruise: '🛳️',
  river: '🛳️',
  tower: '🗼',
  cathedral: '⛪',
  religious: '⛪',
  palace: '🏰',
  castle: '🏰',
  bridge: '🌉',
  observation: '🎡',
  entertainment: '🎪',
}

const categoryAliases: Record<string, string> = {
  history: 'museum',
  historical: 'museum',
  arts: 'museum',
  art: 'museum',
  sightseeing: 'landmark',
  attraction: 'landmark',
  church: 'cathedral',
  basilica: 'cathedral',
  boat: 'cruise',
  waterfront: 'river',
}

export type TripActivityLike = {
  name?: string
  description?: string
  category?: string
  estimatedCost?: number
}

function inferActivityCategory(activity: TripActivityLike): string | null {
  const raw = activity.category?.trim().toLowerCase()
  if (raw) {
    const mapped = categoryAliases[raw] ?? raw
    if (mapped in activityIcons) return mapped
  }

  const blob = `${activity.name ?? ''} ${activity.description ?? ''}`.toLowerCase()

  if (/\b(tower of london)\b/.test(blob)) return 'castle'
  if (/\b(british museum|louvre|museum|galer(y|ía)|gallery)\b/.test(blob)) return 'museum'
  if (/\b(cathedral|basilica|abbey|church|notre)\b/.test(blob)) return 'cathedral'
  if (/\b(buckingham|palace)\b/.test(blob)) return 'palace'
  if (/\b(tower of london|castle)\b/.test(blob)) return 'castle'
  if (/\b(eiffel|tower)\b/.test(blob)) return 'tower'
  if (/\b(london eye|observation wheel|ferris)\b/.test(blob)) return 'observation'
  if (/\b(borough market|markets|market\b)\b/.test(blob)) return 'market'
  if (/\b(bateau|bateaux|cruise|river cruise|seine)\b/.test(blob)) return 'cruise'
  if (/\b(montmartre|park|garden)\b/.test(blob)) return 'park'
  if (/\b(parliament|westminster)\b/.test(blob)) return 'historic'

  return null
}

export function activityIconFor(activity: TripActivityLike): string {
  const inferred = inferActivityCategory(activity)
  if (inferred && activityIcons[inferred]) return activityIcons[inferred]
  const raw = activity.category?.trim().toLowerCase() ?? ''
  if (raw && activityIcons[raw]) return activityIcons[raw]
  return '📍'
}

export function activityCategoryDisplayLabel(activity: TripActivityLike): string {
  const inferred = inferActivityCategory(activity)
  const raw = activity.category?.trim().toLowerCase() ?? ''
  const mapped = raw ? (categoryAliases[raw] ?? raw) : ''
  const key = inferred ?? mapped
  const label = key || 'activity'
  return label.replace(/-/g, ' ').toUpperCase()
}

export function activityShowStar(activity: TripActivityLike): boolean {
  const category = activity.category?.toLowerCase() ?? ''
  const inferred = inferActivityCategory(activity)
  const starCat = inferred ?? (categoryAliases[category] ?? category)
  return (
    starCat === 'landmark' ||
    starCat === 'cultural' ||
    starCat === 'museum' ||
    starCat === 'historic'
  )
}
