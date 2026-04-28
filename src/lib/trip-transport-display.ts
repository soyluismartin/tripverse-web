export const transportIcons: Record<string, string> = {
  flight: '✈️',
  plane: '✈️',
  train: '🚂',
  bus: '🚌',
}

export function transportModeLabel(mode: string) {
  const m = mode.trim().toLowerCase()
  if (m === 'flight' || m === 'plane') return 'Flight'
  if (m === 'train') return 'Train'
  if (m === 'bus') return 'Bus'
  return mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()
}
