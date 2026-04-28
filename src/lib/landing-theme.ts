import type { CSSProperties } from 'react'

/**
 * Design tokens for the marketing landing (`src/app/page.tsx`).
 * Single source so trip viewer surfaces match inline landing styles.
 */
export const BG = 'var(--color-bg)'
export const CARD = 'var(--color-surface)'
export const SEC = 'var(--color-surface-2)'
export const DARK = 'var(--color-text)'
export const MUTED = 'var(--color-muted)'
export const BDL = 'var(--color-border)'
export const BDM = 'var(--color-border-md)'
export const BLUE = 'var(--color-accent)'
export const BLBG = 'var(--color-accent-bg)'
export const SHADOW = 'var(--shadow-card)'

/** Same as landing `stat-callout-card` / `accent-card`: `padding: 42px 28px 34px` (page.tsx) — clamps on small screens */
export const LANDING_CARD_PADDING =
	'clamp(26px, 5vw, 42px) clamp(20px, 4vw, 28px) clamp(22px, 4.5vw, 34px)' as const

export const landingTripCardSurface: CSSProperties = {
	background: CARD,
	border: `1px solid ${BDL}`,
	padding: LANDING_CARD_PADDING,
}
