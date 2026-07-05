// Computes ISO from/to bounds for the History screen's preset filters.
// `to` is inclusive of the whole day it names.
function startOfDay(d) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

// Formats a Date as a local YYYY-MM-DD string. Deliberately does NOT go
// through toISOString(), because toISOString() converts to UTC first — for
// any timezone ahead of UTC (e.g. IST, UTC+5:30) that silently rolls local
// midnight back onto the previous UTC calendar day, so the "to" bound ended
// up one day behind and quietly excluded that entire day's bills from the
// Today/Yesterday/Week/Month filters.
function toDateInputValue(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getPresetRange(preset) {
  const today = startOfDay(new Date())

  if (preset === 'today') {
    return { from: today.toISOString(), to: toDateInputValue(today) }
  }

  if (preset === 'yesterday') {
    const y = new Date(today)
    y.setDate(y.getDate() - 1)
    return { from: y.toISOString(), to: toDateInputValue(y) }
  }

  if (preset === 'week') {
    // Week starts Monday
    const day = today.getDay() === 0 ? 7 : today.getDay()
    const monday = new Date(today)
    monday.setDate(monday.getDate() - (day - 1))
    return { from: monday.toISOString(), to: toDateInputValue(today) }
  }

  if (preset === 'month') {
    const first = new Date(today.getFullYear(), today.getMonth(), 1)
    return { from: first.toISOString(), to: toDateInputValue(today) }
  }

  return { from: null, to: null }
}

export const presets = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'custom', label: 'Custom' },
]
