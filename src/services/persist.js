// The mock data layer lives only in memory by default, which resets on
// every page reload — easy to mistake for "my bill didn't save". This
// wraps it with localStorage so demo data survives reloads until the real
// Postgres backend is wired in (see the TODOs in api.js).
const PREFIX = 'ayini-pos-v2:'

export function loadPersisted(key, seed) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

export function savePersisted(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage disabled (private browsing, quota) — falls back to in-memory only.
  }
}

export function clearPersisted() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    // ignore
  }
}
