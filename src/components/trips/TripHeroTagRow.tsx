import type { HeroMetaChip, HeroMetaChipIconKind } from '@/lib/trip-hero-meta'
import { getDisplayedTags, TripTagPillIcon } from '@/lib/trip-style-tags'

function TripLikeOutlineIcon() {
	return (
		<svg className="trip-card-like-icon trip-card-like-icon-outline" viewBox="0 0 16 16" aria-hidden="true">
			<path d="M8 13.2S2.8 10.1 2.8 6.1A2.6 2.6 0 0 1 8 5a2.6 2.6 0 0 1 5.2 1.1c0 4-5.2 7.1-5.2 7.1Z" />
		</svg>
	)
}

function HeroMetaChipGlyph({ kind }: { kind: HeroMetaChipIconKind }) {
	switch (kind) {
		case 'pets':
			return (
				<svg className="trip-meta-chip-icon" viewBox="0 0 16 16" aria-hidden="true">
					<ellipse cx="8" cy="11.5" rx="5.5" ry="3.5" />
					<ellipse cx="5.5" cy="6.5" rx="2.8" ry="3.2" />
					<ellipse cx="10.5" cy="6.5" rx="2.8" ry="3.2" />
				</svg>
			)
		case 'calendar':
			return (
				<svg className="trip-meta-chip-icon" viewBox="0 0 16 16" aria-hidden="true">
					<rect height="11" rx="2" width="12" x="2" y="3.5" />
					<path d="M2 7h12M6 2v3M10 2v3" />
				</svg>
			)
		case 'destinations':
			return (
				<svg className="trip-meta-chip-icon" viewBox="0 0 16 16" aria-hidden="true">
					<path d="M8 14s5-4.4 5-8.5A5 5 0 0 0 3 5.5C3 9.6 8 14 8 14Z" />
					<circle cx="8" cy="6" r="1.6" />
				</svg>
			)
		case 'budget':
			return (
				<svg className="trip-meta-chip-icon" viewBox="0 0 16 16" aria-hidden="true">
					<circle cx="8" cy="8" r="6.5" />
					<path d="M8 5v7M10 6.5c0-1.2-.9-2-2-2s-2 .8-2 2 .9 2 2 2 2-.8 2-2" />
				</svg>
			)
		case 'pace':
			return (
				<svg className="trip-meta-chip-icon" viewBox="0 0 16 16" aria-hidden="true">
					<circle cx="8" cy="3.5" r="1.5" />
					<path d="M7 6 6 11l3 1M9 12 8 14M6 7 4 10M9 7l3 3" />
				</svg>
			)
		case 'travelers':
		default:
			return (
				<svg className="trip-meta-chip-icon" viewBox="0 0 16 16" aria-hidden="true">
					<circle cx="8" cy="5" r="2.5" />
					<path d="M3.5 14c.8-3 2.4-4 4.5-4s3.7 1 4.5 4" />
				</svg>
			)
	}
}

type TripHeroTagRowProps = {
	likesCount: number
	metaChips?: HeroMetaChip[]
	styleTags: string[]
}

export function TripHeroTagRow({ styleTags, metaChips = [], likesCount }: TripHeroTagRowProps) {
	const displayed = getDisplayedTags(styleTags)
	const likesLabel =
		likesCount === 0 ? '0 likes' : likesCount === 1 ? '1 like' : `${likesCount} likes`

	return (
		<div className="trip-card-tags trip-detail-hero-tags-row">
			{displayed.map(tag => (
				<span
					key={tag.id}
					className="trip-pill trip-pill--hero-style-solid"
					style={{
						background: tag.accent,
						borderColor: 'transparent',
						color: '#ffffff',
					}}
				>
					<TripTagPillIcon symbol={tag.sfSymbol} />
					{tag.label}
				</span>
			))}
			{metaChips.map(chip => (
				<span key={`meta-${chip.key}`} className="trip-meta-chip">
					<HeroMetaChipGlyph kind={chip.icon} />
					{chip.label}
				</span>
			))}
			<span
				className="trip-card-likes trip-card-likes-readonly trip-detail-hero-likes"
				role="img"
				aria-label={likesLabel}
				title="Los likes solo se pueden gestionar en la app Tripverse."
			>
				<TripLikeOutlineIcon />
				{likesCount > 0 ? (
					<span className="trip-card-likes-count" aria-hidden="true">
						{likesCount}
					</span>
				) : null}
			</span>
		</div>
	)
}
