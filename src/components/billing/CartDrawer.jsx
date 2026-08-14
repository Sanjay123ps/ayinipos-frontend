import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { PiMinusBold, PiPencilSimpleBold, PiPlusBold, PiTrashSimpleBold, PiXBold } from 'react-icons/pi'
import { useCart } from '../../context/CartContext'
import Button from '../ui/Button'
import ProductAvatar from '../ui/ProductAvatar'
import { formatINR, round2, lineAmount } from '../../utils/currency'
import { searchCustomers } from '../../services/api'

const paymentModes = ['Cash', 'UPI', 'Card', 'Credit']

export default function CartDrawer({ open, onClose, paymentMode, onPaymentMode, onGenerateBill, generating }) {
  const {
    items,
    updateQty,
    setLineFinalPrice,
    removeItem,
    discountPercent,
    setDiscountPercent,
    customerMobile,
    setCustomerMobile,
    customerName,
    setCustomerName,
    totals,
  } = useCart()

  const [suggestions, setSuggestions] = useState([])
  // Which cart line's final price is currently being edited, plus the
  // in-progress text value for that line's input.
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Autofill: as the mobile number is typed, look up matching customers so
  // the operator can tap one and have name/address filled in automatically.
  useEffect(() => {
    if (customerMobile.length < 3) {
      setSuggestions([])
      return
    }
    let cancelled = false
    searchCustomers(customerMobile).then((results) => {
      if (!cancelled) setSuggestions(results)
    })
    return () => {
      cancelled = true
    }
  }, [customerMobile])

  function selectSuggestion(customer) {
    setCustomerMobile(customer.mobile)
    setCustomerName(customer.name || '')
    setSuggestions([])
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditValue(String(lineAmount(item)))
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValue('')
  }

  function confirmEdit(item) {
    const value = Number(editValue)
    if (editValue.trim() === '' || !Number.isFinite(value) || value < 0) {
      cancelEdit()
      return
    }
    setLineFinalPrice(item.id, value)
    cancelEdit()
  }

  function resetToCalculated(item) {
    setLineFinalPrice(item.id, null)
    if (editingId === item.id) cancelEdit()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-porcelain rounded-t-[28px] shadow-lift max-h-[88vh] flex flex-col animate-[slideUp_0.18s_ease-out]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="font-display text-lg text-ink">Current bill</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-ledger"
          >
            <PiXBold size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-ledger text-center py-10">Your cart is empty.</p>
          )}
          {items.map((item) => {
            const isEditing = editingId === item.id
            const isEdited = item.finalPrice != null
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-soft p-3 space-y-2">
                <div className="flex items-center gap-3">
                  <ProductAvatar product={item} className="w-11 h-11 text-xl" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                    <p className="text-xs text-ledger figures">
                      {formatINR(item.price)}{item.unit === 'kg' ? '/kg' : ' each'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        updateQty(item.id, item.unit === 'kg' ? round2(item.qty - 0.25) : item.qty - 1)
                      }
                      className="w-7 h-7 rounded-full bg-mist flex items-center justify-center text-ink"
                    >
                      <PiMinusBold size={12} />
                    </button>
                    <span className="text-sm w-8 text-center figures">
                      {item.unit === 'kg' ? `${item.qty}kg` : item.qty}
                    </span>
                    <button
                      onClick={() =>
                        updateQty(
                          item.id,
                          item.unit === 'kg' ? round2(item.qty + 0.25) : Math.min(item.stock, item.qty + 1)
                        )
                      }
                      disabled={item.unit !== 'kg' && item.qty >= item.stock}
                      className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <PiPlusBold size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded-full bg-chili-50 text-chili-600 flex items-center justify-center ml-1"
                    >
                      <PiTrashSimpleBold size={12} />
                    </button>
                  </div>
                </div>

                {/* Final Price Editor: lets the cashier type a different
                    total for this line. Not shown as a "discount" — just
                    the line's amount, editable in place. */}
                <div className="flex items-center justify-between pl-[56px] gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-xs text-ledger shrink-0">₹</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') confirmEdit(item)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        className="w-24 rounded-lg border border-emerald-500/50 bg-porcelain px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 figures"
                      />
                      <button
                        onClick={() => confirmEdit(item)}
                        className="text-xs font-medium text-emerald-700 px-2 py-1 rounded-lg bg-emerald-50"
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} className="text-xs font-medium text-ledger px-2 py-1">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-ink figures">
                        {formatINR(lineAmount(item))}
                      </span>
                      <div className="flex items-center gap-3">
                        {isEdited && (
                          <button
                            onClick={() => resetToCalculated(item)}
                            className="text-[11px] font-medium text-ledger underline decoration-dotted"
                          >
                            Reset
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(item)}
                          className="flex items-center gap-1 text-[11px] font-medium text-emerald-700"
                        >
                          <PiPencilSimpleBold size={11} /> Edit price
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {items.length > 0 && (
            <>
              <div className="bg-white rounded-2xl shadow-soft p-4 space-y-3">
                <div className="relative">
                  <label className="text-xs font-medium text-ledger mb-1.5 block">
                    Customer mobile number
                  </label>
                  <input
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-mist bg-porcelain px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 figures"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 left-0 right-0 mt-1 bg-white rounded-xl shadow-lift border border-mist overflow-hidden">
                      {suggestions.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => selectSuggestion(c)}
                          className="w-full text-left px-3.5 py-2 text-sm hover:bg-porcelain flex items-center justify-between"
                        >
                          <span className="text-ink">{c.name || 'Unnamed'}</span>
                          <span className="text-ledger figures text-xs">{c.mobile}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-ledger mb-1.5 block">Customer name</label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-mist bg-porcelain px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ledger mb-1.5 block">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-mist bg-porcelain px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 figures"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ledger mb-1.5 block">Payment method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {paymentModes.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => onPaymentMode(mode)}
                        className={clsx(
                          'rounded-xl py-2 text-xs font-medium border transition-colors',
                          paymentMode === mode
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-porcelain text-ledger border-mist'
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  {paymentMode === 'Credit' && (
                    <p className="text-xs text-turmeric-600 mt-1.5">
                      This bill will be added to Credit Bills as pending until it's closed out.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-ledger">
                  <span>Subtotal</span>
                  <span className="figures">{formatINR(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-ledger">
                  <span>GST</span>
                  <span className="figures">{formatINR(totals.gstAmount)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-chili-600">
                    <span>Discount</span>
                    <span className="figures">-{formatINR(totals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-lg text-ink pt-1.5 border-t border-mist mt-1.5">
                  <span>Total</span>
                  <span className="figures">{formatINR(totals.total)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          // A single calc() declaration, not `py-4 safe-bottom` — two
          // classes both setting padding-bottom don't add together, the
          // later one in the stylesheet just wins outright, which was
          // silently dropping the intended 16px base padding on any device
          // with a zero safe-area inset (most non-gesture-nav phones).
          <div className="px-5 pt-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <Button full size="lg" onClick={onGenerateBill} disabled={generating}>
              {generating ? 'Generating…' : `Generate bill · ${formatINR(totals.total)}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
