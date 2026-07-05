export function formatINR(amount, withSymbol = true) {
  const n = Number(amount) || 0
  const formatted = n.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return withSymbol ? `₹${formatted}` : formatted
}

export function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100
}
