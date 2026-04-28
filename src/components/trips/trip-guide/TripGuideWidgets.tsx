'use client'

import {
  activityIconFor,
  activityShowStar,
  type TripActivityLike,
} from '@/lib/trip-activity-icons'
import { formatTripMoney } from '@/lib/trip-format'
import { normalizeTransport } from '@/lib/trip-guide'
import { transportIcons, transportModeLabel } from '@/lib/trip-transport-display'
import {
  mergeDestinationWithHighlight,
  type CityHighlight,
  type TripGuideDestination,
} from '@/lib/trip-city-highlights'
import { useTripGuideModals, type TripGuideRouteSegment } from './TripGuideModalProvider'

export function TripOverviewChips({
  destinations,
  cityHighlights,
}: {
  destinations: TripGuideDestination[]
  cityHighlights?: CityHighlight[]
}) {
  const { openCityHighlight } = useTripGuideModals()

  return (
    <div className="trip-overview-chip-scroll" role="list">
      {destinations.map((d, index) => (
        <button
          key={`${d.city ?? 'c'}-${index}`}
          type="button"
          className="trip-overview-chip trip-overview-chip--button"
          role="listitem"
          onClick={() => openCityHighlight(mergeDestinationWithHighlight(d, cityHighlights))}
        >
          {d.flag} {d.city}
        </button>
      ))}
    </div>
  )
}

export function ActivityCardInteractive({
  activity,
  cityLabel,
}: {
  activity: TripActivityLike
  cityLabel: string
}) {
  const { openActivity } = useTripGuideModals()
  const isFree = (activity.estimatedCost ?? 0) === 0
  const icon = activityIconFor(activity)
  const showStar = activityShowStar(activity)

  return (
    <button
      type="button"
      className="activity-card activity-card--clickable"
      onClick={() => openActivity(activity, cityLabel)}
    >
      <div className="activity-icon-wrap">
        <span className="activity-icon-emoji" aria-hidden>
          {icon}
        </span>
      </div>
      <div className="activity-title-row">
        <strong className={`activity-name${showStar ? ' activity-name--starred' : ''}`}>{activity.name}</strong>
      </div>
      <p className="activity-desc">{activity.description}</p>
      <div className={isFree ? 'activity-foot activity-foot-free' : 'activity-foot'}>
        {isFree ? 'Free' : `$${formatTripMoney(activity.estimatedCost)}`}
      </div>
    </button>
  )
}

export function TransportConnectorInteractive({
  from,
  to,
  raw,
}: {
  from: TripGuideRouteSegment
  to: TripGuideRouteSegment
  raw?: Record<string, unknown>
}) {
  const { openTransport } = useTripGuideModals()
  const transport = normalizeTransport(raw)
  if (!transport) return null

  const icon = transportIcons[transport.mode] ?? '✈️'
  const modeLabel = transportModeLabel(transport.mode)

  return (
    <div className="transport-connector">
      <div className="transport-line-wrap" aria-hidden="true">
        <div className="transport-line" />
      </div>
      <button
        type="button"
        className="transport-card transport-card--clickable"
        onClick={() => openTransport(from, to, raw)}
      >
        <div className="transport-card-left">
          <span className="transport-card-emoji" aria-hidden>
            {icon}
          </span>
          <div className="transport-card-titles">
            <div className="transport-mode">{modeLabel}</div>
            {transport.operator ? <div className="transport-meta">{transport.operator}</div> : null}
            {transport.via ? (
              <div className="transport-layover-subtle">
                Layover · via <strong>{transport.via}</strong>
              </div>
            ) : null}
          </div>
        </div>
        <div className="transport-card-right">
          <div className="transport-duration">{transport.duration}</div>
          <div className="transport-price-stack">
            <strong className="transport-est-price">{`~$${formatTripMoney(transport.estimatedCost)}`}</strong>
            <span className="transport-est-label">est.</span>
          </div>
          <span className="transport-card-chevron" aria-hidden="true">
            ›
          </span>
        </div>
      </button>
    </div>
  )
}
