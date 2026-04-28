'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { normalizeTransport, type NormalizedTransport } from '@/lib/trip-guide'
import { formatTripMoney } from '@/lib/trip-format'
import {
  activityCategoryDisplayLabel,
  activityIconFor,
  type TripActivityLike,
} from '@/lib/trip-activity-icons'
import { transportIcons, transportModeLabel } from '@/lib/trip-transport-display'
import type { TripGuideDestination } from '@/lib/trip-city-highlights'

export type { TripGuideDestination }

export type TripGuideRouteSegment = TripGuideDestination & {
  days?: number
  transportToNext?: Record<string, unknown>
}

type TransportSelection = {
  key: number
  from: TripGuideRouteSegment
  to: TripGuideRouteSegment
  connection: NormalizedTransport
}

type TripGuideModalContextValue = {
  openCityHighlight: (d: TripGuideDestination) => void
  openActivity: (activity: TripActivityLike, cityLabel: string) => void
  openTransport: (
    from: TripGuideRouteSegment,
    to: TripGuideRouteSegment,
    raw?: Record<string, unknown>
  ) => void
}

const TripGuideModalContext = createContext<TripGuideModalContextValue | null>(null)

function ModalDismissButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="trip-guide-modal-dismiss" aria-label="Close" onClick={onClick}>
      <span className="trip-guide-modal-dismiss-icon" aria-hidden>
        ×
      </span>
    </button>
  )
}

/** Flow content first; dismiss control is last in the DOM and floats above (does not shift layout). */
function TripGuideModalFrame({
  labelledBy,
  className,
  onDismiss,
  children,
}: {
  labelledBy: string
  className?: string
  onDismiss: () => void
  children: ReactNode
}) {
  return (
    <div
      className={['trip-guide-modal-dialog', className].filter(Boolean).join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className="trip-guide-modal-dialog-inner">{children}</div>
      <div className="trip-guide-modal-dismiss-anchor">
        <ModalDismissButton onClick={onDismiss} />
      </div>
    </div>
  )
}

export function useTripGuideModals() {
  const ctx = useContext(TripGuideModalContext)
  if (!ctx) throw new Error('useTripGuideModals requires TripGuideModalProvider')
  return ctx
}

type Props = {
  children: ReactNode
}

export function TripGuideModalProvider({ children }: Props) {
  const [city, setCity] = useState<TripGuideDestination | null>(null)
  const [activity, setActivity] = useState<{ activity: TripActivityLike; cityLabel: string } | null>(
    null
  )
  const [transport, setTransport] = useState<TransportSelection | null>(null)
  const transportKeyRef = useRef(0)

  const closeAll = useCallback(() => {
    setCity(null)
    setActivity(null)
    setTransport(null)
  }, [])

  const openCityHighlight = useCallback((d: TripGuideDestination) => {
    setActivity(null)
    setTransport(null)
    setCity(d)
  }, [])

  const openActivity = useCallback((act: TripActivityLike, cityLabel: string) => {
    setCity(null)
    setTransport(null)
    setActivity({ activity: act, cityLabel })
  }, [])

  const openTransport = useCallback(
    (from: TripGuideRouteSegment, to: TripGuideRouteSegment, raw?: Record<string, unknown>) => {
      const connection = normalizeTransport(raw)
      if (!connection) return
      setCity(null)
      setActivity(null)
      transportKeyRef.current += 1
      setTransport({
        key: transportKeyRef.current,
        from,
        to,
        connection,
      })
    },
    []
  )

  const open = Boolean(city) || Boolean(activity) || Boolean(transport)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    const prevOverflowX = document.body.style.overflowX
    document.body.style.overflow = 'hidden'
    document.body.style.overflowX = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.overflowX = prevOverflowX
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeAll])

  const cityTitleId = useId()
  const activityTitleId = useId()
  const transportTitleId = useId()

  const value: TripGuideModalContextValue = {
    openCityHighlight,
    openActivity,
    openTransport,
  }

  return (
    <TripGuideModalContext.Provider value={value}>
      {children}

      {open ? (
        <div className="trip-guide-modal-root">
          <button
            type="button"
            className="trip-guide-modal-backdrop-hit"
            aria-label="Close dialog"
            onClick={closeAll}
          />
          <div className="trip-guide-modal-shell">
            {city ? (
              <TripGuideModalFrame labelledBy={cityTitleId} onDismiss={closeAll}>
                <div className="trip-guide-city-modal-hero">
                  <span className="trip-guide-city-modal-flag" aria-hidden>
                    {city.flag ?? '🌍'}
                  </span>
                </div>
                <h2 id={cityTitleId} className="trip-guide-modal-title">
                  {city.city ?? 'City'}
                </h2>
                {city.country ? (
                  <p className="trip-guide-modal-muted">{city.country}</p>
                ) : null}
                {city.tagline?.trim() ? (
                  <p className="trip-guide-modal-body">{city.tagline.trim()}</p>
                ) : null}
                {!city.tagline?.trim() && !city.mustSeeSpot?.trim() ? (
                  <p className="trip-guide-modal-body trip-guide-modal-body--muted">
                    No highlight copy is available for this city in the guide.
                  </p>
                ) : null}
                {city.mustSeeSpot?.trim() ? (
                  <div className="trip-guide-city-must-see">
                    <p className="trip-guide-city-must-see-label">
                      <span aria-hidden>★</span> MUST-SEE
                    </p>
                    <p className="trip-guide-city-must-see-copy">{city.mustSeeSpot.trim()}</p>
                  </div>
                ) : null}
              </TripGuideModalFrame>
            ) : null}

            {activity ? (
              <TripGuideModalFrame labelledBy={activityTitleId} onDismiss={closeAll}>
                <div className="trip-guide-activity-modal-hero">
                  <span className="trip-guide-activity-modal-icon" aria-hidden>
                    {activityIconFor(activity.activity)}
                  </span>
                </div>
                <p className="trip-guide-activity-modal-cat">
                  <span aria-hidden>★</span>{' '}
                  <span className="trip-guide-activity-modal-cat-label">
                    {activityCategoryDisplayLabel(activity.activity)}
                  </span>
                </p>
                <h2 id={activityTitleId} className="trip-guide-modal-title">
                  {activity.activity.name ?? 'Activity'}
                </h2>
                {activity.activity.description ? (
                  <p className="trip-guide-modal-body">{activity.activity.description}</p>
                ) : null}
                <p className="trip-guide-modal-muted trip-guide-modal-subtle">
                  {activity.cityLabel}
                </p>
                <div className="trip-guide-activity-price-pill">
                  <span className="trip-guide-activity-price-dot" aria-hidden>
                    $
                  </span>
                  {(activity.activity.estimatedCost ?? 0) === 0 ? (
                    <span>Free</span>
                  ) : (
                    <span>{`~$${formatTripMoney(activity.activity.estimatedCost)} per person`}</span>
                  )}
                </div>
              </TripGuideModalFrame>
            ) : null}

            {transport ? (
              <TripGuideModalFrame key={transport.key} labelledBy={transportTitleId} onDismiss={closeAll}>
                <h2 id={transportTitleId} className="sr-only">
                  Transport details
                </h2>
                <div className="trip-guide-transport-modal-header">
                  <div className="trip-guide-transport-end">
                    <span className="trip-guide-transport-flag" aria-hidden>
                      {transport.from.flag ?? '🌍'}
                    </span>
                    <strong>{transport.from.city ?? '—'}</strong>
                    <span className="trip-guide-transport-cc">{transport.from.country ?? ''}</span>
                  </div>
                  <div className="trip-guide-transport-mid" aria-hidden>
                    <span className="trip-guide-transport-mid-icon">
                      {transportIcons[transport.connection.mode] ?? '✈️'}
                    </span>
                    <span className="trip-guide-transport-mid-arrow">→</span>
                  </div>
                  <div className="trip-guide-transport-end">
                    <span className="trip-guide-transport-flag" aria-hidden>
                      {transport.to.flag ?? '🌍'}
                    </span>
                    <strong>{transport.to.city ?? '—'}</strong>
                    <span className="trip-guide-transport-cc">{transport.to.country ?? ''}</span>
                  </div>
                </div>
                <ul className="trip-guide-transport-rows">
                  <li className="trip-guide-transport-row">
                    <span className="trip-guide-transport-row-icon" aria-hidden>
                      {transportIcons[transport.connection.mode] ?? '✈️'}
                    </span>
                    <span className="trip-guide-transport-row-label">Mode</span>
                    <strong>{transportModeLabel(transport.connection.mode)}</strong>
                  </li>
                  <li className="trip-guide-transport-row">
                    <span className="trip-guide-transport-row-icon" aria-hidden>
                      🏷️
                    </span>
                    <span className="trip-guide-transport-row-label">Operator</span>
                    <strong>{transport.connection.operator ?? '—'}</strong>
                  </li>
                  <li className="trip-guide-transport-row">
                    <span className="trip-guide-transport-row-icon" aria-hidden>
                      ⏱️
                    </span>
                    <span className="trip-guide-transport-row-label">Duration</span>
                    <strong>{transport.connection.duration ?? '—'}</strong>
                  </li>
                  <li className="trip-guide-transport-row">
                    <span className="trip-guide-transport-row-icon" aria-hidden>
                      💵
                    </span>
                    <span className="trip-guide-transport-row-label">Est. price</span>
                    <strong>
                      {transport.connection.estimatedCost != null
                        ? `~$${formatTripMoney(transport.connection.estimatedCost)} per person`
                        : '—'}
                    </strong>
                  </li>
                </ul>
              </TripGuideModalFrame>
            ) : null}
          </div>
        </div>
      ) : null}
    </TripGuideModalContext.Provider>
  )
}
