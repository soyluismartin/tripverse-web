export type TripStyleOption = {
	accent: string
	id: string
	label: string
	sfSymbol: string
}

const styleOptions: TripStyleOption[] = [
	{ id: 'solo_trip', sfSymbol: 'person.fill', label: 'Solo', accent: '#5C7CFA' },
	{ id: 'couples_getaway', sfSymbol: 'person.2.fill', label: 'Couples', accent: '#E91E63' },
	{ id: 'family_vacation', sfSymbol: 'figure.and.child.holdinghands', label: 'Family', accent: '#43A047' },
	{ id: 'friends_trip', sfSymbol: 'person.3.fill', label: 'Friends', accent: '#AB47BC' },
	{ id: 'backpacker', sfSymbol: 'backpack.fill', label: 'Backpacker', accent: '#E07B39' },
	{ id: 'budget', sfSymbol: 'tag.fill', label: 'Budget', accent: '#4CAF50' },
	{ id: 'smart_saver', sfSymbol: 'lightbulb.fill', label: 'Smart Saver', accent: '#26A69A' },
	{ id: 'balanced', sfSymbol: 'slider.horizontal.3', label: 'Balanced', accent: '#5C7CFA' },
	{ id: 'comfort', sfSymbol: 'bed.double.fill', label: 'Comfort', accent: '#4A90D9' },
	{ id: 'boutique', sfSymbol: 'sparkles', label: 'Boutique', accent: '#EC407A' },
	{ id: 'business', sfSymbol: 'briefcase.fill', label: 'Business', accent: '#607D8B' },
	{ id: 'luxury', sfSymbol: 'crown.fill', label: 'Luxury', accent: '#7B5EA7' },
	{ id: 'adventure', sfSymbol: 'mountain.2.fill', label: 'Adventure', accent: '#FF7043' },
	{ id: 'cultural', sfSymbol: 'building.columns.fill', label: 'Cultural', accent: '#8D6E63' },
	{ id: 'foodie', sfSymbol: 'fork.knife', label: 'Foodie', accent: '#F57C00' },
	{ id: 'romantic', sfSymbol: 'heart.fill', label: 'Romantic', accent: '#E91E63' },
	{ id: 'family', sfSymbol: 'figure.and.child.holdinghands', label: 'Family', accent: '#43A047' },
	{ id: 'digital_nomad', sfSymbol: 'laptopcomputer', label: 'Digital Nomad', accent: '#00ACC1' },
	{ id: 'party', sfSymbol: 'music.note', label: 'Party', accent: '#AB47BC' },
	{ id: 'wellness', sfSymbol: 'figure.mind.and.body', label: 'Wellness', accent: '#66BB6A' },
	{ id: 'relaxed_pace', sfSymbol: 'tortoise.fill', label: 'Relaxed', accent: '#26A69A' },
	{ id: 'moderate_pace', sfSymbol: 'figure.walk', label: 'Moderate', accent: '#5C7CFA' },
	{ id: 'fast_pace', sfSymbol: 'figure.run', label: 'Fast-paced', accent: '#FF7043' },
]

const companionIds = new Set(['solo_trip', 'couples_getaway', 'family_vacation', 'friends_trip'])
/** Cost tier / lodging tier — mismo espacio que companion + activity mix en classifyStyle */
const tierIds = new Set([
  'backpacker',
  'budget',
  'smart_saver',
  'comfort',
  'boutique',
  'luxury',
  'digital_nomad',
])
const paceIds = new Set(['relaxed_pace', 'moderate_pace', 'fast_pace'])

/** Misma prioridad que las tarjetas en `/trips` (companion · tier · estilo o ritmo). */
export function getDisplayedTags(tags: string[]): TripStyleOption[] {
	const styles = tags
		.map(tag => styleOptions.find(option => option.id === tag))
		.filter(Boolean) as TripStyleOption[]

	const companion = styles.find(style => companionIds.has(style.id))
	const tier = styles.find(style => tierIds.has(style.id))
	const activity =
		styles.find(
			style => !companionIds.has(style.id) && !tierIds.has(style.id) && !paceIds.has(style.id),
		) ?? styles.find(style => paceIds.has(style.id))

	return [companion, tier, activity].filter(Boolean) as TripStyleOption[]
}

/** Icono SF-symbol-like para pills — compartido con `/trips`. */
export function TripTagPillIcon({ symbol }: { symbol: string }) {
	if (symbol.includes('person.2') || symbol.includes('person.3') || symbol.includes('figure.and.child')) {
		return (
			<svg className="trip-pill-icon" viewBox="0 0 16 16" aria-hidden="true">
				<circle cx="5.2" cy="5.5" r="2" />
				<circle cx="10.8" cy="5.5" r="2" />
				<path d="M2.8 12c.5-2 1.6-3 2.4-3s1.9 1 2.4 3M8.4 12c.5-2 1.6-3 2.4-3s1.9 1 2.4 3" />
			</svg>
		)
	}

	if (symbol.includes('bed')) {
		return (
			<svg className="trip-pill-icon" viewBox="0 0 16 16" aria-hidden="true">
				<path d="M2.5 11.5v-7M2.5 8h11a1 1 0 0 1 1 1v2.5M2.5 11.5h12M5 8V6h3v2" />
			</svg>
		)
	}

	if (symbol.includes('walk') || symbol.includes('run') || symbol.includes('tortoise')) {
		return (
			<svg className="trip-pill-icon" viewBox="0 0 16 16" aria-hidden="true">
				<circle cx="8" cy="3.2" r="1.4" />
				<path d="M7.5 5.3 6.3 8l2.4 1.2M8.7 9.2 7.5 14M6.4 8 4.2 10.5M8.8 5.8l2.2 1.7" />
			</svg>
		)
	}

	if (symbol.includes('heart')) {
		return (
			<svg className="trip-pill-icon" viewBox="0 0 16 16" aria-hidden="true">
				<path d="M8 13.5S2.8 10.3 2.8 6.2A2.7 2.7 0 0 1 8 5a2.7 2.7 0 0 1 5.2 1.2c0 4.1-5.2 7.3-5.2 7.3Z" />
			</svg>
		)
	}

	if (symbol.includes('sparkles') || symbol.includes('crown')) {
		return (
			<svg className="trip-pill-icon" viewBox="0 0 16 16" aria-hidden="true">
				<path d="M8 1.8 9.2 6 13.4 8 9.2 10 8 14.2 6.8 10 2.6 8 6.8 6 8 1.8Z" />
			</svg>
		)
	}

	return (
		<svg className="trip-pill-icon" viewBox="0 0 16 16" aria-hidden="true">
			<circle cx="8" cy="8" r="4.5" />
		</svg>
	)
}
