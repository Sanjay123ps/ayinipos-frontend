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

// Cart Final Price Editor: a cart line's actual billed amount is its
// manually edited final price when set, otherwise the normal unit price ×
// quantity calculation. Shared by CartContext (totals), CartDrawer (the
// editor UI), and Billing (the amount sent to the server) so all three stay
// in sync by construction rather than by convention.
export function lineAmount(item) {
  return item.finalPrice != null ? item.finalPrice : round2(item.price * item.qty)
}
