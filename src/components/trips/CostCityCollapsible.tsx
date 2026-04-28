'use client'

import { useId, useState } from 'react'
import type { normalizeCityCostRow } from '@/lib/trip-guide'
import { formatTripMoney } from '@/lib/trip-format'

export type CityCostBreakdown = ReturnType<typeof normalizeCityCostRow>

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
      <span className={detail.trim() ? 'cost-line-detail' : 'cost-line-detail cost-line-detail-empty'}>
        {detail.trim()}
      </span>
      <strong className="cost-line-amount">{`$${formatTripMoney(total)}`}</strong>
    </div>
  )
}

export function CostCityCollapsible({
  city,
  defaultExpanded = false,
}: {
  city: CityCostBreakdown
  defaultExpanded?: boolean
}) {
  const [open, setOpen] = useState(defaultExpanded)
  const uid = useId()
  const panelId = `cost-city-panel-${uid}`
  const days = city.days ?? 0

  return (
    <div className={`trip-city-block trip-city-block--cost${open ? ' trip-city-block--cost-open' : ''}`}>
      <button
        type="button"
        className="cost-city-header cost-city-header--toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(o => !o)}
      >
        <span className="cost-city-heading">
          <span className="cost-city-flag" aria-hidden>
            {city.flag}
          </span>
          <span className="cost-city-name">{city.city}</span>
          <span className="cost-city-days">{`${days}d`}</span>
        </span>
        <strong className="cost-city-subtotal">{`$${formatTripMoney(city.total)}`}</strong>
        <span className="cost-city-chevron" aria-hidden="true">
          {open ? '⌃' : '⌄'}
        </span>
      </button>
      <div id={panelId} className="cost-city-collapse-panel" hidden={!open}>
        <CostLine
          icon="🛏️"
          label="Accommodation"
          detail={`$${formatTripMoney(city.accommodationPerNight)}/night × ${days}`}
          total={city.accommodationTotal}
        />
        <CostLine icon="🍽️" label="Food" detail={`$${formatTripMoney(city.foodPerDay)}/day × ${days}`} total={city.foodTotal} />
        <CostLine
          icon="🎟️"
          label="Activities"
          detail={`$${formatTripMoney(city.activitiesPerDay)}/day × ${days}`}
          total={city.activitiesTotal}
        />
        {city.note ? <p className="cost-note">{city.note}</p> : null}
      </div>
    </div>
  )
}
