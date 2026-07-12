// Computes ISO from/to bounds for the History and Reports screens' preset
// filters. `to` is inclusive of the whole day it names.
function startOfDay(d) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

// End of the local day (23:59:59.999), as a real Date. Converting THIS to
// ISO (not a bare date string) is what makes the "to" bound safe — see the
// note on getPresetRange below.
function endOfDay(d) {
  const copy = new Date(d)
  copy.setHours(23, 59, 59, 999)
  return copy
}

// Formats a Date as a local YYYY-MM-DD string. Deliberately does NOT go
// through toISOString(), because toISOString() converts to UTC first — for
// any timezone ahead of UTC (e.g. IST, UTC+5:30) that silently rolls local
// midnight back onto the previous UTC calendar day. Kept as a general-
// purpose local-date formatter (e.g. for pre-filling a date input); it is
// no longer used to build the "to" bound below — see endOfDay instead.
function toDateInputValue(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export { startOfDay, endOfDay, toDateInputValue }

// `from` and `to` are both built as real Date instants converted via
// toISOString() — never a bare "YYYY-MM-DD" string. A bare date sent to the
// backend gets interpreted in Postgres's session timezone (UTC), which for
// IST (UTC+5:30) silently clipped up to ~5.5 hours of early-morning sales
// out of "today"'s results. Building full instants here, and comparing
// them with plain >=/<= server-side, sidesteps that entirely.
export function getPresetRange(preset) {
  const today = startOfDay(new Date())

  if (preset === 'today') {
    return { from: today.toISOString(), to: endOfDay(today).toISOString() }
  }

  if (preset === 'yesterday') {
    const y = new Date(today)
    y.setDate(y.getDate() - 1)
    return { from: y.toISOString(), to: endOfDay(y).toISOString() }
  }

  if (preset === 'week') {
    // Week starts Monday
    const day = today.getDay() === 0 ? 7 : today.getDay()
    const monday = new Date(today)
    monday.setDate(monday.getDate() - (day - 1))
    return { from: monday.toISOString(), to: endOfDay(today).toISOString() }
  }

  if (preset === 'month') {
    const first = new Date(today.getFullYear(), today.getMonth(), 1)
    return { from: first.toISOString(), to: endOfDay(today).toISOString() }
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
