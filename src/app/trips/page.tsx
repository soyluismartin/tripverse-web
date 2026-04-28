import type { Metadata } from 'next'
import { FeedSortOption, getAvailableTripTags, getPublicTrips, Trip } from '@/lib/trips'
import { getDisplayedTags, TripTagPillIcon } from '@/lib/trip-style-tags'

export const metadata: Metadata = {
  title: 'Explore trips — Tripverse',
  description:
    'Browse community itineraries with full routes, costs, and trip guides. Filter by travel style, sort by trending or newest, and open any trip for inspiration.',
  openGraph: {
    title: 'Explore trips — Tripverse',
    description:
      'Discover real itineraries from travelers — routes, budgets, activities, and guides in one feed.',
    type: 'website',
  },
}

export const revalidate = 60

type RouteSegment = {
  city?: string
  flag?: string
  days?: number
}

type RouteVersion = {
  segments?: RouteSegment[]
  totalTransportCost?: number
}

type CostVersion = {
  totals?: {
    grandTotal?: number
  }
  grandTotal?: number
}

const avatarPalette = ['#5C7CFA', '#E91E63', '#FF9800', '#4CAF50', '#9C27B0', '#00BCD4', '#FF5722', '#795548', '#607D8B', '#F06292', '#26A69A', '#FFC107']
const sortOptions: { id: FeedSortOption; label: string; icon: string }[] = [
  { id: 'trending', label: 'Trending', icon: 'flame' },
  { id: 'topAllTime', label: 'Top', icon: 'crown' },
  { id: 'recent', label: 'Newest', icon: 'clock' },
]

const allTagOptions: { id: string; label: string; icon: string }[] = [
  { id: 'solo_trip', label: 'Solo', icon: 'person' },
  { id: 'couples_getaway', label: 'Couples', icon: 'people' },
  { id: 'friends_trip', label: 'Friends', icon: 'people' },
  { id: 'family_vacation', label: 'Family', icon: 'people' },
  { id: 'budget', label: 'Budget', icon: 'tag' },
  { id: 'comfort', label: 'Comfort', icon: 'bed' },
  { id: 'luxury', label: 'Luxury', icon: 'crown' },
  { id: 'adventure', label: 'Adventure', icon: 'mountain' },
  { id: 'cultural', label: 'Cultural', icon: 'columns' },
  { id: 'foodie', label: 'Foodie', icon: 'food' },
  { id: 'wellness', label: 'Wellness', icon: 'wellness' },
  { id: 'relaxed_pace', label: 'Relaxed', icon: 'tortoise' },
  { id: 'fast_pace', label: 'Fast-paced', icon: 'run' },
  { id: 'romantic', label: 'Romantic', icon: 'heart' },
  { id: 'party', label: 'Party', icon: 'music' },
]

function getFirstVersion<T>(value: unknown): T | null {
  if (!value) return null

  if (Array.isArray(value)) {
    return (value[0] ?? null) as T | null
  }

  if (typeof value === 'object') {
    const objectValue = value as { versions?: unknown }

    if (Array.isArray(objectValue.versions)) {
      return (objectValue.versions[0] ?? null) as T | null
    }

    return value as T
  }

  return null
}

function getRouteVersion(trip: Trip) {
  return getFirstVersion<RouteVersion>(trip.routes[0]?.route_data)
}

function getRouteStops(trip: Trip, activeRoute: RouteVersion | null) {
  const segments = activeRoute?.segments ?? []

  if (segments.length > 0) {
    return segments.filter(segment => segment.city)
  }

  return trip.destinations
    .map(destination => {
      const city = destination?.city
      return { city, flag: destination?.flag, days: 1 }
    })
    .filter(Boolean)
}

function getDestinationCount(trip: Trip, activeRoute: RouteVersion | null) {
  const citySegments = activeRoute?.segments?.filter(segment => (segment.days ?? 0) > 0)
  return citySegments?.length || Math.max(trip.destinations.length - 2, 0) || trip.destinations.length
}

function getTotalDays(activeRoute: RouteVersion | null) {
  return activeRoute?.segments?.reduce((total, segment) => {
    return total + Math.max(segment.days ?? 0, 0)
  }, 0) ?? 0
}

function getDisplayCost(trip: Trip, activeRoute: RouteVersion | null) {
  const route = trip.routes[0]
  const activeCosts = getFirstVersion<CostVersion>(route?.costs_data)
  const metaData = route?.meta_data as { grandTotal?: number; totalCost?: number } | null

  return activeCosts?.totals?.grandTotal
    ?? activeCosts?.grandTotal
    ?? metaData?.grandTotal
    ?? metaData?.totalCost
    ?? activeRoute?.totalTransportCost
    ?? 0
}

function getAuthor(trip: Trip) {
  const user = Array.isArray(trip.users) ? trip.users[0] : trip.users
  return user?.username ?? 'traveler'
}

function getAuthorColor(trip: Trip) {
  const user = Array.isArray(trip.users) ? trip.users[0] : trip.users
  if (user?.avatar_color) return `#${user.avatar_color.replace(/^#/, '')}`

  const name = user?.username ?? 'traveler'
  const hash = Array.from(name).reduce((total, char) => (total * 31) + char.charCodeAt(0), 0)
  return avatarPalette[Math.abs(hash) % avatarPalette.length]
}

function getAuthorAvatarUrl(trip: Trip) {
  const user = Array.isArray(trip.users) ? trip.users[0] : trip.users
  return user?.avatar_url
}

function getInitials(username: string) {
  return username.replace(/^@/, '').slice(0, 2).toUpperCase()
}

function StatIcon({ type }: { type: 'pin' | 'calendar' | 'plane' }) {
  if (type === 'calendar') {
    return (
      <svg className="trip-card-stat-icon" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
        <path d="M5 2.5v3M11 2.5v3M2.5 6.5h11" />
      </svg>
    )
  }

  if (type === 'plane') {
    return (
      <svg className="trip-card-stat-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 9.1 14 3.5 9.4 14 7.2 9.8 2 9.1Z" />
      </svg>
    )
  }

  return (
    <svg className="trip-card-stat-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 14s4-4.2 4-8A4 4 0 0 0 4 6c0 3.8 4 8 4 8Z" />
      <circle cx="8" cy="6" r="1.4" />
    </svg>
  )
}

/** Outline heart — mismo rol visual que SF Symbol `heart` (solo lectura en web). */
function TripCardHeartOutlineIcon() {
  return (
    <svg className="trip-card-like-icon trip-card-like-icon-outline" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 13.2S2.8 10.1 2.8 6.1A2.6 2.6 0 0 1 8 5a2.6 2.6 0 0 1 5.2 1.1c0 4-5.2 7.1-5.2 7.1Z" />
    </svg>
  )
}

function TripCard({ trip }: { trip: Trip }) {
  const route = trip.routes[0]
  const activeRoute = getRouteVersion(trip)
  const routeStops = getRouteStops(trip, activeRoute)
  const tags = getDisplayedTags(trip.tags)
  const destinationCount = getDestinationCount(trip, activeRoute)
  const totalDays = getTotalDays(activeRoute)
  const displayCost = getDisplayCost(trip, activeRoute)
  const author = getAuthor(trip)
  const authorColor = getAuthorColor(trip)
  const authorAvatarUrl = getAuthorAvatarUrl(trip)

  if (!route?.slug) return null

  const likesLabel =
    trip.likes_count === 0
      ? '0 likes'
      : trip.likes_count === 1
        ? '1 like'
        : `${trip.likes_count} likes`

  return (
    <div className="trip-card">
      <a href={`/trips/${route.slug}`} className="trip-card-main-link">
        <div className="trip-card-title-row">
          <h2 className="trip-card-title">{trip.trip_headline}</h2>
          <span className="trip-card-chevron">›</span>
        </div>

        <div className="trip-card-route">
          {routeStops.map((stop, index) => (
            <span key={`${stop.city}-${index}`}>
              {index > 0 && <span className="trip-card-route-separator"> → </span>}
              <span className={(stop.days ?? 0) > 0 ? 'trip-card-route-stop' : 'trip-card-route-stop trip-card-route-stop-muted'}>
                {`${stop.flag ?? ''}\u00A0${stop.city ?? ''}`}
              </span>
            </span>
          ))}
        </div>

        <div className="trip-card-stats">
          <span className="trip-card-stat"><StatIcon type="pin" />{`${destinationCount} destinations`}</span>
          <span>|</span>
          <span className="trip-card-stat"><StatIcon type="calendar" />{`${totalDays} days`}</span>
          <span>|</span>
          <span className="trip-card-stat"><StatIcon type="plane" />{`$${Math.round(displayCost).toLocaleString('en-US')}`}</span>
        </div>

        <div className="trip-card-tags">
          {tags.map(tag => (
            <span
              key={tag.id}
              className="trip-pill"
              style={{
                background: `color-mix(in srgb, ${tag.accent} 8%, transparent)`,
                borderColor: `color-mix(in srgb, ${tag.accent} 25%, transparent)`,
                color: tag.accent,
              }}
            >
              <TripTagPillIcon symbol={tag.sfSymbol} />
              {tag.label}
            </span>
          ))}
        </div>

        <hr className="trip-card-divider" />
      </a>

      <div className="trip-card-footer">
        <div className="trip-card-author">
          {authorAvatarUrl ? (
            <img className="trip-card-avatar" src={authorAvatarUrl} alt="" />
          ) : (
            <span
              className="trip-card-avatar"
              style={{
                background: `color-mix(in srgb, ${authorColor} 15%, transparent)`,
                color: authorColor,
              }}
            >
              {getInitials(author)}
            </span>
          )}
          <span>{`@${author.replace(/^@/, '')}`}</span>
        </div>
        {/* Solo lectura: mismo aspecto que TripCardView (normal); dar like solo en la app. */}
        <span
          className="trip-card-likes trip-card-likes-readonly"
          role="img"
          aria-label={likesLabel}
          title="Los likes solo se pueden gestionar en la app Tripverse."
        >
          <TripCardHeartOutlineIcon />
          {trip.likes_count > 0 && (
            <span className="trip-card-likes-count" aria-hidden="true">
              {trip.likes_count}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

type TripsPageProps = {
  searchParams?: Promise<{
    sort?: string
    tag?: string
  }>
}

function buildTripsHref(sort: FeedSortOption, tag?: string | null) {
  const params = new URLSearchParams()
  if (sort !== 'trending') params.set('sort', sort)
  if (tag) params.set('tag', tag)
  const query = params.toString()
  return query ? `/trips?${query}` : '/trips'
}

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const params = await searchParams
  const sort = sortOptions.some(option => option.id === params?.sort) ? params?.sort as FeedSortOption : 'trending'
  const selectedTag = params?.tag ?? null

  let trips: Trip[] = []
  let availableTags = new Set<string>()
  let feedLoadFailed = false

  try {
    const [t, tags] = await Promise.all([
      getPublicTrips(0, 12, { sort, filterTag: selectedTag }),
      getAvailableTripTags(),
    ])
    trips = t
    availableTags = tags
  } catch (e) {
    console.error('[TripsPage] feed load', e)
    feedLoadFailed = true
  }

  const currentSort = sortOptions.find(option => option.id === sort) ?? sortOptions[0]
  const filterOptions = allTagOptions.filter(option => availableTags.has(option.id))

  return (
    <main className="trips-page">
      <div className="trips-shell">
        <header className="trips-page-header">
          <h1>Discover</h1>
          <p>Explore the best trips shared by travelers like you.</p>
        </header>

        {feedLoadFailed ? (
          <p className="trips-feed-warning" role="status">
            No pudimos cargar el listado desde el servidor. Intenta recargar la página en unos minutos.
          </p>
        ) : null}

        <div className="trips-filter-bar" aria-label="Trip filters">
          <details className="trips-sort-menu">
            <summary className="trips-filter-pill trips-sort-pill">
              <FilterIcon type={currentSort.icon} />
              {currentSort.label}
              <FilterIcon type="chevron-down" />
            </summary>
            <div className="trips-sort-options">
              {sortOptions.map(option => (
                <a key={option.id} href={buildTripsHref(option.id, selectedTag)} className={option.id === sort ? 'trips-sort-option trips-sort-option-active' : 'trips-sort-option'}>
                  <FilterIcon type={option.icon} />
                  {option.label}
                </a>
              ))}
            </div>
          </details>

          <div className="trips-filter-separator" />

          <div className="trips-tag-scroll">
            <a href={buildTripsHref(sort)} className={!selectedTag ? 'trips-filter-pill trips-filter-pill-active' : 'trips-filter-pill'}>
              <FilterIcon type="grid" />
              All
            </a>
            {filterOptions.map(option => (
              <a key={option.id} href={buildTripsHref(sort, option.id)} className={selectedTag === option.id ? 'trips-filter-pill trips-filter-pill-active' : 'trips-filter-pill'}>
                <FilterIcon type={option.icon} />
                {option.label}
              </a>
            ))}
          </div>
        </div>

        {trips.length > 0 ? (
          <div className="trips-grid">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <p className="trips-empty">No trips yet</p>
        )}
      </div>
    </main>
  )
}

function FilterIcon({ type }: { type: string }) {
  if (type === 'chevron-down') {
    return (
      <svg className="trips-filter-icon trips-filter-chevron" viewBox="0 0 16 16" aria-hidden="true">
        <path d="m4 6 4 4 4-4" />
      </svg>
    )
  }

  if (type === 'clock') {
    return (
      <svg className="trips-filter-icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="5" />
        <path d="M8 5v3l2.2 1.3" />
      </svg>
    )
  }

  if (type === 'crown') {
    return (
      <svg className="trips-filter-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2.5 6.2 5.2 9 8 4l2.8 5 2.7-2.8-1 6.3h-9l-1-6.3Z" />
      </svg>
    )
  }

  if (type === 'grid') {
    return (
      <svg className="trips-filter-icon" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="3" y="3" width="4" height="4" rx="1" />
        <rect x="9" y="3" width="4" height="4" rx="1" />
        <rect x="3" y="9" width="4" height="4" rx="1" />
        <rect x="9" y="9" width="4" height="4" rx="1" />
      </svg>
    )
  }

  if (type === 'people' || type === 'person') {
    return (
      <svg className="trips-filter-icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="5.2" cy="5.5" r="2" />
        <circle cx="10.8" cy="5.5" r="2" />
        <path d="M2.8 12c.5-2 1.6-3 2.4-3s1.9 1 2.4 3M8.4 12c.5-2 1.6-3 2.4-3s1.9 1 2.4 3" />
      </svg>
    )
  }

  if (type === 'bed') {
    return (
      <svg className="trips-filter-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2.5 11.5v-7M2.5 8h11a1 1 0 0 1 1 1v2.5M2.5 11.5h12M5 8V6h3v2" />
      </svg>
    )
  }

  if (['tag', 'mountain', 'columns', 'food', 'wellness', 'tortoise', 'run', 'heart', 'music'].includes(type)) {
    return (
      <svg className="trips-filter-icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="4.5" />
      </svg>
    )
  }

  return (
    <svg className="trips-filter-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2.5c2 2.2 3 3.8 3 5.7a3 3 0 0 1-6 0c0-1.8 1.2-3 2.1-4.2.3.9.7 1.4.9 1.8.4-.8.3-2.1 0-3.3Z" />
    </svg>
  )
}
