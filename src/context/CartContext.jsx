import { createContext, useContext, useMemo, useState } from 'react'
import { round2 } from '../utils/currency'

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
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { ...product, qty }]
    })
  }

  function updateQty(id, qty) {
    if (qty <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
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
    const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.qty, 0))
    const gstAmount = round2(
      items.reduce((sum, i) => sum + (i.price * i.qty * (i.gst || 0)) / 100, 0)
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
