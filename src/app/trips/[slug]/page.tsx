import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Button from '@/components/ui/Button'
import { TripHeroTagRow } from '@/components/trips/TripHeroTagRow'
import { getTripBySlug, Trip } from '@/lib/trips'
import { normalizeTotals, normalizeCityCostRow, pickVersion } from '@/lib/trip-guide'
import {
  extractTripNarrative,
  normalizeFinanceExtras,
  type FinanceExtras,
} from '@/lib/trip-route-extras'
import type { HeroMetaChip } from '@/lib/trip-hero-meta'
import { buildHeroMetaChips, mergeStyleTagIds } from '@/lib/trip-hero-meta'
import TripRouteMap from '@/components/trips/TripRouteMap'
import { CostCityCollapsible } from '@/components/trips/CostCityCollapsible'
import { TripGuideModalProvider } from '@/components/trips/trip-guide/TripGuideModalProvider'
import {
  ActivityCardInteractive,
  TransportConnectorInteractive,
  TripOverviewChips,
} from '@/components/trips/trip-guide/TripGuideWidgets'
import { type TripActivityLike } from '@/lib/trip-activity-icons'
import { formatTripMoney } from '@/lib/trip-format'
import { landingTripCardSurface } from '@/lib/landing-theme'
import {
  normalizeCityHighlights,
  type CityHighlight,
  type TripGuideDestination,
} from '@/lib/trip-city-highlights'

export const revalidate = 300

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ version?: string }>
}

type Destination = {
  city?: string
  country?: string
  flag?: string
}

type RouteSegment = Destination & {
  days?: number
  transportToNext?: Record<string, unknown>
}

type RouteVersion = {
  label?: string
  segments?: RouteSegment[]
  totalTransportCost?: number
}

type BookingItem = {
  city?: string
  tip?: string
  urgency?: string
}

type RationaleVersion = {
  label?: string
  tripHeadline?: string
  summary?: string
  highlights?: string[]
  bookingTips?: BookingItem[]
  /** From `rationale_data`; same shape as Supabase / `cityHighlights` in CSV exports. */
  cityHighlights?: CityHighlight[]
}

type AccommodationOption = {
  name?: string
  zone?: string
  zones?: string
  zoneNote?: string
  pricePerNight?: number
  nightlyPrice?: number
}

type Activity = TripActivityLike

type FoodSpot = {
  name?: string
  description?: string
  estimatedCost?: number
  price?: number
  avgCost?: number
}

type ActivitiesCity = Destination & {
  accommodation?: {
    hostel?: AccommodationOption
    hotel?: AccommodationOption
    airbnb?: AccommodationOption
  }
  activities?: Activity[]
  foodSpots?: FoodSpot[]
}

type ActivitiesVersion = {
  label?: string
  cities?: ActivitiesCity[]
}

type CityVersionCosts = {
  label?: string
  cityBreakdowns?: Record<string, unknown>[]
  totals?: Record<string, unknown>
  budgetNote?: string
}

const foodSpotGlyphs = ['🍽️', '🛒', '☕', '🏪']

/** Igual que `getRouteStops` en `/trips/page.tsx`: incluye aeropuertos/origen/vuelta (`days === 0`). */
function routeDisplayStops(trip: Trip, segments: RouteSegment[] | undefined): RouteSegment[] {
  const list = segments ?? []
  const withCity = list.filter(s => (s.city ?? '').trim())
  if (withCity.length > 0) return withCity
  return (trip.destinations ?? [])
    .flatMap(d => {
      if (!d || typeof d !== 'object') return []
      const destination = d as Destination
      return [{
        city: destination.city,
        country: destination.country,
        flag: destination.flag,
        days: 1,
      }]
    })
    .filter(s => (s.city ?? '').trim())
}

function TripRouteLineHero({ stops }: { stops: RouteSegment[] }) {
  if (stops.length === 0) return null

  return (
    <p className="trip-detail-route-line trip-detail-route-line--stops">
      {stops.map((stop, index) => (
        <span key={`${stop.city ?? 'stop'}-${index}`}>
          {index > 0 ? <span className="trip-detail-route-separator"> → </span> : null}
          <span
            className={
              (stop.days ?? 0) > 0 ? 'trip-detail-route-stop' : 'trip-detail-route-stop trip-detail-route-stop-muted'
            }
          >
            {`${stop.flag ?? ''}\u00A0${stop.city ?? ''}`}
          </span>
        </span>
      ))}
    </p>
  )
}

function sectionHeading(children: string) {
  return <h2 className="trip-detail-section-heading">{children}</h2>
}

function TripOverviewSection({
  trip,
  narrative,
  cityHighlights,
}: {
  trip: Trip
  narrative?: string
  cityHighlights?: CityHighlight[]
}) {
  const dest = (trip.destinations ?? []) as TripGuideDestination[]
  if (!narrative?.trim() && dest.length === 0) return null

  return (
    <TripDetailCard>
      <h2 className="trip-detail-section-heading trip-overview-section-title">
        <span className="trip-overview-sparkle" aria-hidden>
          ✨
        </span>{' '}
        Trip overview
      </h2>
      {narrative?.trim() ? <p className="trip-overview-narrative">{narrative.trim()}</p> : null}
      {dest.length > 0 ? (
        <TripOverviewChips destinations={dest} cityHighlights={cityHighlights} />
      ) : null}
    </TripDetailCard>
  )
}

function RouteMapSection({ segments }: { segments?: RouteSegment[] }) {
  const list = segments ?? []
  if (list.length === 0) return null

  return (
    <TripDetailCard>
      {sectionHeading('Your route')}
      <TripRouteMap segments={list} />
    </TripDetailCard>
  )
}

function FinanceDocsSafetySection({
  extras,
  costTotals,
}: {
  extras: FinanceExtras
  costTotals: {
    transport: number
    accommodation: number
    food: number
    activities: number
  }
}) {
  const { strategicSummary, documents, safety, payments, checklistLines } = extras
  const pieSum =
    costTotals.transport + costTotals.accommodation + costTotals.food + costTotals.activities
  const hasBody =
    pieSum > 0 ||
    Boolean(strategicSummary?.trim()) ||
    documents.length > 0 ||
    safety.length > 0 ||
    payments.length > 0 ||
    checklistLines.length > 0
  if (!hasBody) return null

  return (
    <TripDetailCard>
      {sectionHeading('Finances, documents & safety')}
      {pieSum > 0 ? (
        <div className="trip-detail-finance-pie-well">
          <CostSplitPie
            accommodation={costTotals.accommodation}
            activities={costTotals.activities}
            food={costTotals.food}
            pieHeading={false}
            transport={costTotals.transport}
          />
        </div>
      ) : null}
      {strategicSummary ? <p className="finance-strategic-summary">{strategicSummary}</p> : null}

      {documents.length > 0 ? (
        <>
          <h3 className="trip-detail-subheading trip-detail-subheading-kicker">Documents</h3>
          <ul className="trip-detail-bullet-list trip-detail-bullet-list--finance">
            {documents.map((line, index) => (
              <li key={`doc-${index}-${line.slice(0, 24)}`}>{line}</li>
            ))}
          </ul>
        </>
      ) : null}

      {safety.length > 0 ? (
        <>
          <h3 className="trip-detail-subheading trip-detail-subheading-kicker">Safety</h3>
          <ul className="trip-detail-bullet-list trip-detail-bullet-list--finance">
            {safety.map((line, index) => (
              <li key={`safe-${index}-${line.slice(0, 24)}`}>{line}</li>
            ))}
          </ul>
        </>
      ) : null}

      {payments.length > 0 ? (
        <>
          <h3 className="trip-detail-subheading trip-detail-subheading-kicker">Payments</h3>
          <ul className="trip-detail-bullet-list trip-detail-bullet-list--finance">
            {payments.map((line, index) => (
              <li key={`pay-${index}-${line.slice(0, 24)}`}>{line}</li>
            ))}
          </ul>
        </>
      ) : null}

      {checklistLines.length > 0 ? (
        <>
          <h3 className="trip-detail-subheading trip-detail-subheading-kicker">Final checklist</h3>
          <ul className="trip-detail-numbered-list trip-detail-numbered-list--checklist">
            {checklistLines.map((line, index) => (
              <li key={`chk-${index}`}>
                <label className="trip-detail-checklist-row">
                  <input className="trip-detail-checklist-input" type="checkbox" />
                  <span className="trip-detail-checklist-text">{line.replace(/^\d+\.\s*/, '')}</span>
                </label>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </TripDetailCard>
  )
}

function CostSplitPie({
  transport,
  accommodation,
  food,
  activities,
  pieHeading,
}: {
  transport: number
  accommodation: number
  food: number
  activities: number
  /** `false` = sin subtítulo (tarjeta grande ya lleva título). */
  pieHeading?: string | false
}) {
  const sum = transport + accommodation + food + activities
  if (sum <= 0) return null

  type Slice = { label: string; value: number; color: string }
  const slices: Slice[] = [
    { label: 'Transport', value: transport, color: '#0286fd' },
    { label: 'Accommodation', value: accommodation, color: '#7c4dff' },
    { label: 'Food', value: food, color: '#ff9800' },
    { label: 'Activities', value: activities, color: '#4caf50' },
  ].filter(s => s.value > 0)

  if (slices.length === 0) return null

  let angle = 0
  const parts = slices.map(s => {
    const span = (s.value / sum) * 360
    const start = angle
    angle += span
    return `${s.color} ${start}deg ${angle}deg`
  })

  const title = pieHeading === false ? null : pieHeading ?? 'Spend mix'

  return (
    <div className="trip-detail-pie-block">
      {title ? <h3 className="trip-detail-subheading">{title}</h3> : null}
      <div className="trip-detail-pie-row">
        <div
          className="trip-detail-pie"
          style={{ background: `conic-gradient(from 0deg, ${parts.join(', ')})` }}
          role="img"
          aria-label="Cost breakdown by category"
        />
        <ul className="trip-detail-pie-legend">
          {slices.map(s => (
            <li key={s.label}>
              <span className="trip-detail-pie-swatch" style={{ background: s.color }} aria-hidden />
              <span>{s.label}</span>
              <span className="trip-detail-pie-pct">{`${Math.round((s.value / sum) * 100)}% · $${formatTripMoney(s.value)}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TripDetailCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={['trip-detail-card', className].filter(Boolean).join(' ')}
      style={landingTripCardSurface}
    >
      {children}
    </section>
  )
}

function TransportNode({
  segment,
  segmentIndex,
  segmentCount,
  stopNumber,
}: {
  segment: RouteSegment
  segmentIndex: number
  segmentCount: number
  stopNumber: number
}) {
  const isAirport = (segment.days ?? 0) === 0
  const isReturn = isAirport && segmentIndex === segmentCount - 1 && segmentIndex > 0
  const isFrom = isAirport && segmentIndex === 0
  const isIntermediateAirport = isAirport && !isFrom && !isReturn

  return (
    <div className="transport-node">
      <div className={isAirport ? 'transport-circle transport-circle-dark' : 'transport-circle'}>
        {isAirport ? (
          <span className="transport-airport-icon" aria-hidden>
            {isReturn ? '🛬' : '🛫'}
          </span>
        ) : (
          <span className="transport-flag-emoji">{segment.flag}</span>
        )}
      </div>
      <div className="transport-node-body">
        {isFrom && (
          <>
            <div className="transport-kicker">FROM</div>
            <div className="transport-city">{segment.city}</div>
            <div className="transport-meta">{segment.country}</div>
          </>
        )}
        {isReturn && (
          <>
            <div className="transport-kicker">RETURN</div>
            <div className="transport-city">{segment.city}</div>
            <div className="transport-meta">{segment.country}</div>
          </>
        )}
        {isIntermediateAirport && (
          <>
            <div className="transport-city">{segment.city}</div>
            <div className="transport-meta">{segment.country}</div>
          </>
        )}
        {!isAirport && (
          <>
            <div className="transport-city">{`#${stopNumber} ${segment.city ?? ''}`}</div>
            <div className="transport-meta">{`${segment.days ?? 0} days · ${segment.country ?? ''}`}</div>
          </>
        )}
      </div>
    </div>
  )
}

function TransportSection({ activeRoute }: { activeRoute: RouteVersion }) {
  const segments = activeRoute.segments ?? []
  if (segments.length === 0) return null

  let stopCounter = 0

  return (
    <TripDetailCard>
      {sectionHeading('Transport')}
      <div className="transport-list">
        {segments.map((segment, index) => {
          const isAirport = (segment.days ?? 0) === 0
          const stopNumber = !isAirport ? ++stopCounter : 0

          return (
            <div key={`${segment.city}-${index}`} className="transport-segment-block">
              <TransportNode
                segment={segment}
                segmentIndex={index}
                segmentCount={segments.length}
                stopNumber={stopNumber}
              />
              {index < segments.length - 1 ? (
                <TransportConnectorInteractive
                  from={segment}
                  to={segments[index + 1]}
                  raw={segment.transportToNext as Record<string, unknown> | undefined}
                />
              ) : null}
            </div>
          )
        })}
      </div>
      <div className="transport-total-row">
        <div className="transport-total">
          <span className="transport-total-icon" aria-hidden="true">
            ✈
          </span>
          <span className="transport-total-copy">{`~$${formatTripMoney(activeRoute.totalTransportCost)} total transport`}</span>
        </div>
      </div>
    </TripDetailCard>
  )
}

function AccommodationRow({
  label,
  icon,
  option,
}: {
  label: 'HOSTEL' | 'HOTEL' | 'AIRBNB'
  icon: string
  option?: AccommodationOption
}) {
  if (!option) return null

  const colorClass = label.toLowerCase()
  const place = option.name ?? option.zones ?? option.zone
  const area = option.zone ?? option.zones
  const price = option.pricePerNight ?? option.nightlyPrice
  const nightlyPrefix = label === 'AIRBNB' ? '~' : ''

  return (
    <div className="stay-row">
      <div className={`stay-icon ${colorClass}`}>{icon}</div>
      <div className="stay-content">
        <span className={`stay-label ${colorClass}`}>{label}</span>
        <strong>{place}</strong>
        {area ? <span>{area}</span> : null}
        {option.zoneNote ? <small>{option.zoneNote}</small> : null}
      </div>
      <div className="stay-price">{price ? `${nightlyPrefix}$${formatTripMoney(price)}/night` : null}</div>
    </div>
  )
}

function CityHeader({ city }: { city: Destination }) {
  return (
    <h3 className="trip-city-header">
      {city.flag} {city.city}
    </h3>
  )
}

function StayCity({ city }: { city: ActivitiesCity }) {
  return (
    <div className="trip-city-block">
      <CityHeader city={city} />
      <AccommodationRow label="HOSTEL" icon="🛏️" option={city.accommodation?.hostel} />
      <AccommodationRow label="HOTEL" icon="🏨" option={city.accommodation?.hotel} />
      <AccommodationRow label="AIRBNB" icon="🏠" option={city.accommodation?.airbnb} />
    </div>
  )
}

function WhereToStaySection({ activeActivities }: { activeActivities: ActivitiesVersion }) {
  const cities = activeActivities.cities ?? []
  if (cities.length === 0) return null

  return (
    <TripDetailCard>
      {sectionHeading('Where to stay')}
      {cities.map((city, index) => (
        <StayCity key={city.city ? `${city.city}-${index}` : `stay-${index}`} city={city} />
      ))}
    </TripDetailCard>
  )
}

function FoodSpotRow({ spot, index }: { spot: FoodSpot; index: number }) {
  const price = spot.estimatedCost ?? spot.price ?? spot.avgCost
  const glyph = foodSpotGlyphs[index % foodSpotGlyphs.length]

  return (
    <div className="food-row">
      <span className="food-row-icon" aria-hidden>
        {glyph}
      </span>
      <div className="food-row-copy">
        <strong>{spot.name}</strong>
        <p>{spot.description}</p>
      </div>
      <span className="food-row-price">{price ? `~$${formatTripMoney(price)}` : ''}</span>
    </div>
  )
}

function ActivitiesCityBlock({ city }: { city: ActivitiesCity }) {
  const cityLabel = [city.flag, city.city].filter(Boolean).join(' ')
  return (
    <div className="trip-city-block">
      <CityHeader city={city} />
      <div className="activities-scroll">
        {(city.activities ?? []).map(activity => (
          <ActivityCardInteractive key={activity.name} activity={activity} cityLabel={cityLabel} />
        ))}
      </div>
      {(city.foodSpots?.length ?? 0) > 0 ? (
        <div className="food-list">
          {city.foodSpots?.map((spot, index) => (
            <FoodSpotRow key={spot.name ?? index} spot={spot} index={index} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ActivitiesSection({ activeActivities }: { activeActivities: ActivitiesVersion }) {
  const cities = activeActivities.cities ?? []
  if (cities.length === 0) return null

  return (
    <TripDetailCard className="trip-detail-card--activities">
      {sectionHeading('Activities & food')}
      {cities.map((city, index) => (
        <ActivitiesCityBlock
          key={city.city ? `${city.city}-${index}` : `activities-${index}`}
          city={city}
        />
      ))}
    </TripDetailCard>
  )
}

function CostLine({
  icon,
  label,
  detail,
  total,
}: {
  icon: string
  label: string
  detail: string
  total?: number
}) {
  return (
    <div className="cost-line">
      <div className="cost-line-main">
        <span className="cost-line-icon" aria-hidden>
          {icon}
        </span>
        <span className="cost-line-label">{label}</span>
      </div>
      <span className={detail.trim() ? 'cost-line-detail' : 'cost-line-detail cost-line-detail-empty'}>{detail.trim()}</span>
      <strong className="cost-line-amount">{`$${formatTripMoney(total)}`}</strong>
    </div>
  )
}

function CostBreakdownSection({ activeCosts }: { activeCosts: CityVersionCosts }) {
  const rawCities = activeCosts.cityBreakdowns ?? []
  const normalized = rawCities.map(raw => normalizeCityCostRow(raw as Record<string, unknown>))
  const totalsMerged = normalizeTotals(activeCosts.totals as Record<string, unknown> | undefined)
  const budgetNote = activeCosts.budgetNote ?? totalsMerged.budgetNote

  return (
    <TripDetailCard>
      {sectionHeading('Cost breakdown · per person')}
      {normalized.map((city, index) => (
        <CostCityCollapsible
          key={city.city ? `${city.city}-${index}` : `cost-${index}`}
          city={city}
          defaultExpanded={index === 0}
        />
      ))}

      <div className="cost-totals">
        <CostLine icon="✈️" label="Transport" detail="" total={totalsMerged.transport} />
        <CostLine icon="🏨" label="Accommodation" detail="" total={totalsMerged.accommodation} />
        <CostLine icon="🍽️" label="Food" detail="" total={totalsMerged.food} />
        <CostLine icon="🎟️" label="Activities" detail="" total={totalsMerged.activities} />
        <div className="grand-total">
          <div className="grand-total-copy">
            <span className="grand-total-kicker">GRAND TOTAL</span>
            <span className="grand-total-sub">per person</span>
          </div>
          <strong className="grand-total-value">{`$${formatTripMoney(totalsMerged.grandTotal)}`}</strong>
        </div>
        {budgetNote ? <p className="budget-note">{budgetNote}</p> : null}
      </div>
    </TripDetailCard>
  )
}

function urgencyDotClass(u?: string) {
  switch ((u ?? '').toLowerCase()) {
    case 'high':
      return 'booking-tip-dot booking-tip-dot-high'
    case 'medium':
      return 'booking-tip-dot booking-tip-dot-medium'
    default:
      return 'booking-tip-dot booking-tip-dot-low'
  }
}

function RationaleSection({ activeRationale }: { activeRationale: RationaleVersion }) {
  const tips = activeRationale.bookingTips ?? []
  const hasContent =
    Boolean(activeRationale.summary?.trim()) ||
    (activeRationale.highlights ?? []).length > 0 ||
    tips.length > 0
  if (!hasContent) return null

  return (
    <TripDetailCard>
      {sectionHeading('Why this route?')}
      {activeRationale.summary ? <p className="rationale-summary">{activeRationale.summary}</p> : null}
      <ul className="rationale-list">
        {(activeRationale.highlights ?? []).map(item => (
          <li key={item} className="rationale-item">
            <span className="rationale-check" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="8" fill="var(--color-success)" />
                <path d="M4.8 8.4 7 10.6 11.6 5.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {tips.length > 0 ? (
        <>
          <h2 className="trip-detail-section-heading trip-detail-section-heading--booking">
            Booking tips
          </h2>
          <ul className="booking-tip-list">
            {tips.map((tip, index) => (
              <li key={`${tip.city}-${index}`} className="booking-tip-row">
                <span className={urgencyDotClass(tip.urgency)} aria-hidden />
                <div>
                  <strong>{tip.city}</strong>
                  <p>{tip.tip}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </TripDetailCard>
  )
}

function HeaderSection({
  trip,
  activeRationale,
  heroMetaChips,
  mergedStyleTags,
  routeSegments,
}: {
  trip: Trip
  activeRationale: RationaleVersion
  heroMetaChips: HeroMetaChip[]
  mergedStyleTags: string[]
  routeSegments: RouteSegment[]
}) {
  const routeStops = routeDisplayStops(trip, routeSegments)

  return (
    <header className="trip-detail-hero-landing">
      <div className="trip-detail-hero-copy">
        <h1 className="trip-detail-title trip-detail-title--hero">
          {activeRationale.tripHeadline ?? trip.trip_headline}
        </h1>
        <TripRouteLineHero stops={routeStops} />
      </div>
      <TripHeroTagRow likesCount={trip.likes_count} metaChips={heroMetaChips} styleTags={mergedStyleTags} />
    </header>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const trip = await getTripBySlug(slug)

    if (!trip) return {}

    const route = trip.routes[0]

    return {
      title: route.meta_title,
      description: route.meta_description,
    }
  } catch (err) {
    console.error('[SSR /trips/[slug] generateMetadata]', err)
    return { title: 'Trip — Tripverse' }
  }
}

export default async function TripDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const query = await searchParams
  const versionQuery = query?.version

  let trip: Trip | null = null
  try {
    trip = await getTripBySlug(slug)
  } catch (err) {
    console.error('[SSR /trips/[slug]] getTripBySlug', err)
    return (
      <main className="trips-page">
        <div className="trips-shell trip-detail-error-shell">
          <h1 className="trip-detail-title">Something went wrong</h1>
          <p className="trip-detail-route-line">
            We couldn&apos;t load this trip. It may be a temporary issue — try again in a moment.
          </p>
          <Button href="/trips" variant="secondary" size="lg">
            Back to trips
          </Button>
        </div>
      </main>
    )
  }

  if (!trip) notFound()

  const route = trip.routes[0]
  if (!route) notFound()

  const routeWrapper = route.route_data as { versions?: RouteVersion[] }
  const rationaleWrapper = route.rationale_data as { versions?: RationaleVersion[] }
  const costsWrapper = route.costs_data as { versions?: CityVersionCosts[] }
  const activitiesWrapper = route.activities_data as { versions?: ActivitiesVersion[] }

  const activeRoute = pickVersion<RouteVersion>(routeWrapper, versionQuery)
  if (!activeRoute) notFound()

  try {
    const activeRationale = pickVersion<RationaleVersion>(rationaleWrapper, versionQuery) ?? {}
    const activeCosts = pickVersion<CityVersionCosts>(costsWrapper, versionQuery) ?? {
      cityBreakdowns: [],
      totals: {},
    }
    const activeActivities = pickVersion<ActivitiesVersion>(activitiesWrapper, versionQuery) ?? { cities: [] }

    const narrative = extractTripNarrative(activeRationale as Record<string, unknown>, route.meta_data)
    const financeVersion = pickVersion<Record<string, unknown>>(route.finance_data as unknown, versionQuery)
    const totalsMerged = normalizeTotals(activeCosts.totals as Record<string, unknown> | undefined)
    const financeExtras = normalizeFinanceExtras(financeVersion ?? undefined, route.meta_data)

    const mergedStyleTags = mergeStyleTagIds(trip.tags, route.meta_data)
    const heroMetaChips = buildHeroMetaChips({
      grandTotal: totalsMerged.grandTotal,
      meta: route.meta_data,
      segments: activeRoute.segments ?? [],
      trip,
    })

    return (
      <div className="trip-detail-page">
        {/* Hero como la primera sección del home: superficie blanca, titular protagonista (sin segunda tarjeta blanca encima). */}
        <section className="trip-detail-stripe trip-detail-stripe--marketing-hero">
          <div className="trip-detail-landing-inner">
            <div className="trip-detail-shell trip-detail-shell--hero">
              <HeaderSection
                activeRationale={activeRationale}
                heroMetaChips={heroMetaChips}
                mergedStyleTags={mergedStyleTags}
                routeSegments={activeRoute.segments ?? []}
                trip={trip}
              />
            </div>
          </div>
        </section>

        {/* Una sola franja gris con todas las tarjetas → mismo ritmo que `gap` entre cards (no falta contenido). */}
        <section className="trip-detail-stripe">
          <div className="trip-detail-landing-inner">
            <TripGuideModalProvider>
              <div className="trip-detail-shell">
                <TripOverviewSection
                  trip={trip}
                  narrative={narrative}
                  cityHighlights={normalizeCityHighlights(activeRationale.cityHighlights)}
                />
                <RouteMapSection segments={activeRoute.segments} />
                <TransportSection activeRoute={activeRoute} />
                <WhereToStaySection activeActivities={activeActivities} />
                <ActivitiesSection activeActivities={activeActivities} />
                <CostBreakdownSection activeCosts={activeCosts} />
                <RationaleSection activeRationale={activeRationale} />
                <FinanceDocsSafetySection
                  costTotals={{
                    accommodation: totalsMerged.accommodation,
                    activities: totalsMerged.activities,
                    food: totalsMerged.food,
                    transport: totalsMerged.transport,
                  }}
                  extras={financeExtras}
                />
              </div>
            </TripGuideModalProvider>
          </div>
        </section>

        <section className="trip-detail-stripe trip-detail-stripe--cta-band" aria-labelledby="trip-detail-cta-heading">
          <div className="trip-detail-landing-inner">
            <div className="trip-detail-cta-landing">
              <h2 id="trip-detail-cta-heading" className="trip-detail-cta-title">
                Take this route with guides, maps & live costs
              </h2>
              <Button href="/#download" variant="secondary" size="lg">
                Download on the App Store
              </Button>
            </div>
          </div>
        </section>

        <div className="mobile-download-cta">
          <Button href="/#download" variant="secondary" size="lg">
            Download Tripverse
          </Button>
        </div>
      </div>
    )
  } catch (err) {
    console.error('[SSR /trips/[slug]] render', err)
    return (
      <main className="trips-page">
        <div className="trips-shell trip-detail-error-shell">
          <h1 className="trip-detail-title">Something went wrong</h1>
          <p className="trip-detail-route-line">
            We couldn&apos;t load this trip. It may be a temporary issue — try again in a moment.
          </p>
          <Button href="/trips" variant="secondary" size="lg">
            Back to trips
          </Button>
        </div>
      </main>
    )
  }
}
