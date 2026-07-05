import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { PiMinusBold, PiPlusBold, PiTrashSimpleBold, PiXBold } from 'react-icons/pi'
import { useCart } from '../../context/CartContext'
import Button from '../ui/Button'
import { formatINR } from '../../utils/currency'
import { searchCustomers } from '../../services/api'

const paymentModes = ['Cash', 'UPI', 'Card', 'Credit']

export default function CartDrawer({ open, onClose, paymentMode, onPaymentMode, onGenerateBill, generating }) {
  const {
    items,
    updateQty,
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
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-soft p-3 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                <p className="text-xs text-ledger figures">{formatINR(item.price)} each</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-7 h-7 rounded-full bg-mist flex items-center justify-center text-ink"
                >
                  <PiMinusBold size={12} />
                </button>
                <span className="text-sm w-5 text-center figures">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center"
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
          ))}

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
          <div className="px-5 py-4 safe-bottom">
            <Button full size="lg" onClick={onGenerateBill} disabled={generating}>
              {generating ? 'Generating…' : `Generate bill · ${formatINR(totals.total)}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
