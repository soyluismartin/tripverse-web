import { createServerClient } from '@/lib/supabase/server'

export interface TripRoute {
  id?: string
  trip_id?: string
  slug: string
  meta_title: string
  meta_description?: string
  route_data: any
  rationale_data?: any
  costs_data?: any
  activities_data?: any
  finance_data?: any
  meta_data: any
  created_at?: string
}

export interface TripUser {
  username: string
  avatar_color?: string
  avatar_url?: string
}

export interface Trip {
  id: string
  user_id: string
  destinations: any[]
  travel_window: any
  budget: number
  travelers: string
  trip_pace: string
  preferences: any
  tags: string[]
  likes_count: number
  trip_headline: string
  status: string
  created_at: string
  routes: TripRoute[]
  users?: TripUser | TripUser[] | null
}

const tripSelect = `
  id,
  user_id,
  destinations,
  travel_window,
  budget,
  travelers,
  trip_pace,
  preferences,
  tags,
  likes_count,
  trip_headline,
  status,
  created_at,
  routes!inner (
    id,
    trip_id,
    slug,
    meta_title,
    meta_description,
    route_data,
    rationale_data,
    costs_data,
    activities_data,
    finance_data,
    meta_data,
    created_at
  )
`

const publicTripSelect = `
  *,
  routes!inner (
    slug,
    meta_title,
    route_data,
    costs_data,
    meta_data
  ),
  users (
    username,
    avatar_color,
    avatar_url
  )
`

const routeSelect = `
  id,
  trip_id,
  slug,
  meta_title,
  meta_description,
  route_data,
  rationale_data,
  costs_data,
  activities_data,
  finance_data,
  meta_data,
  created_at,
  trips!inner (
    id,
    user_id,
    destinations,
    travel_window,
    budget,
    travelers,
    trip_pace,
    preferences,
    tags,
    likes_count,
    trip_headline,
    status,
    created_at
  )
`

function normalizeRoutes(routes: TripRoute[] | TripRoute | null | undefined) {
  if (!routes) return []
  return Array.isArray(routes) ? routes : [routes]
}

type TripWithoutRoutes = Omit<Trip, 'routes'>
type RouteWithTrip = TripRoute & {
  trips: TripWithoutRoutes | TripWithoutRoutes[]
}

export type FeedSortOption = 'trending' | 'topAllTime' | 'recent'

type PublicTripsOptions = {
  filterTag?: string | null
  sort?: FeedSortOption
}

function getTrendingCutoff() {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  return cutoff.toISOString()
}

// Listado publico de viajes — para /trips
export async function getPublicTrips(page = 0, limit = 12, options: PublicTripsOptions = {}): Promise<Trip[]> {
  const supabase = createServerClient()
  const from = page * limit
  const to = from + limit - 1
  const sort = options.sort ?? 'trending'

  let query = supabase
    .from('trips')
    .select(publicTripSelect)
    .not('routes.slug', 'is', null)

  if (options.filterTag) {
    query = query.filter('tags', 'ov', `{${options.filterTag}}`)
  }

  if (sort === 'trending') {
    query = query.gte('created_at', getTrendingCutoff())
  }

  if (sort === 'recent') {
    query = query.order('created_at', { ascending: false })
  } else {
    query = query
      .order('likes_count', { ascending: false })
      .order('created_at', { ascending: false })
  }

  const { data, error } = await query.range(from, to)

  if (error) throw error

  return (data ?? []).map(trip => ({
    ...trip,
    routes: normalizeRoutes(trip.routes),
  })) as Trip[]
}

export async function getAvailableTripTags(): Promise<Set<string>> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('trips')
    .select('tags')

  if (error) throw error

  const result = new Set<string>()
  for (const row of data ?? []) {
    if (Array.isArray(row.tags)) {
      row.tags.forEach(tag => result.add(tag))
    }
  }

  return result
}

// Viaje por slug — para /trips/[slug]
export async function getTripBySlug(slug: string): Promise<Trip | null> {
  const shortId = slug.split('-').at(-1)
  if (!shortId) return null

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('routes')
    .select(routeSelect)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const { trips, ...route } = data as unknown as RouteWithTrip
  const trip = Array.isArray(trips) ? trips[0] : trips
  if (!trip) return null

  return {
    ...trip,
    routes: [route],
  }
}

// Total de viajes publicos — para sitemap
export async function getPublicTripsCount(): Promise<number> {
  const supabase = createServerClient()

  const { count, error } = await supabase
    .from('trips')
    .select('id, routes!inner(id, slug)', { count: 'exact', head: true })
    .not('routes.slug', 'is', null)

  if (error) throw error

  return count ?? 0
}
