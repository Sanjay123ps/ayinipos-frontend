import { createContext, useContext, useMemo, useState } from 'react'
import { round2, lineAmount } from '../utils/currency'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [discountPercent, setDiscountPercent] = useState(0)
  const [customerMobile, setCustomerMobile] = useState('')
  const [customerName, setCustomerName] = useState('')

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        // Quantity is changing, so any manual final-price edit on this line
        // no longer applies to the new total — recalculate from the
        // original unit price. The cashier can edit the final price again
        // once the new quantity settles.
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty, finalPrice: null } : i
        )
      }
      return [...prev, { ...product, qty, finalPrice: null }]
    })
  }

  function updateQty(id, qty) {
    if (qty <= 0) {
      removeItem(id)
      return
    }
    // See addItem above: a qty change always recalculates from the unit
    // price, clearing any manual final-price override for this line.
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty, finalPrice: null } : i)))
  }

  // Cart Final Price Editor: manually overrides a single line's total
  // (price × qty) with a cashier-typed amount. Pass `null` to clear the
  // override and go back to the automatic calculation. Invalid values
  // (negative, non-numeric) are ignored rather than applied.
  function setLineFinalPrice(id, finalPrice) {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i
        if (finalPrice === null) return { ...i, finalPrice: null }
        const value = round2(Number(finalPrice))
        if (!Number.isFinite(value) || value < 0) return i
        return { ...i, finalPrice: value }
      })
    )
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clearCart() {
    setItems([])
    setDiscountPercent(0)
    setCustomerMobile('')
    setCustomerName('')
  }

  const totals = useMemo(() => {
    // Every total downstream (subtotal, GST, grand total, and therefore
    // checkout/invoice/receipt/sales-history) is derived from lineAmount,
    // which already resolves to the manually edited final price when one
    // is set — so an edit made here is automatically consistent everywhere
    // without needing to touch each of those screens separately.
    const subtotal = round2(items.reduce((sum, i) => sum + lineAmount(i), 0))
    const gstAmount = round2(
      items.reduce((sum, i) => sum + (lineAmount(i) * (i.gst || 0)) / 100, 0)
    )
    const discountAmount = round2((subtotal * discountPercent) / 100)
    const total = round2(subtotal + gstAmount - discountAmount)
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0)
    return { subtotal, gstAmount, discountAmount, total, itemCount }
  }, [items, discountPercent])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        setLineFinalPrice,
        removeItem,
        clearCart,
        discountPercent,
        setDiscountPercent,
        customerMobile,
        setCustomerMobile,
        customerName,
        setCustomerName,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
