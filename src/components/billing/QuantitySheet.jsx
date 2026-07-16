import { useEffect, useState } from 'react'
import { PiMinusBold, PiPlusBold, PiXBold } from 'react-icons/pi'
import Button from '../ui/Button'
import ProductAvatar from '../ui/ProductAvatar'
import { formatINR, round2 } from '../../utils/currency'

export default function QuantitySheet({ product, onConfirm, onClose }) {
  const isWeightPriced = product?.unit === 'kg'
  const [qty, setQty] = useState(1)
  const [weightInput, setWeightInput] = useState('')

  useEffect(() => {
    setQty(1)
    setWeightInput('')
  }, [product])

  if (!product) return null

  const weight = Number(weightInput) || 0
  const amount = isWeightPriced ? product.price * weight : product.price * qty
  const canConfirm = isWeightPriced ? weight > 0 : true

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-t-[28px] shadow-lift p-5 pb-8 animate-[slideUp_0.18s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-mist flex items-center justify-center text-ledger"
        >
          <PiXBold size={14} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <ProductAvatar product={product} className="w-14 h-14 text-2xl" />
          <div>
            <p className="font-medium text-ink">{product.name}</p>
            <p className="text-sm text-ledger figures">
              {formatINR(product.price)}{isWeightPriced && '/kg'} · GST {product.gst}%
            </p>
          </div>
        </div>

        {isWeightPriced ? (
          <div className="mb-6">
            <label className="text-xs font-medium text-ledger mb-1.5 block">Weight (kg)</label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                step="0.05"
                min="0"
                autoFocus
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-mist bg-porcelain px-3.5 py-3 text-2xl font-display text-center outline-none focus:ring-2 focus:ring-emerald-500/40 figures"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ledger">kg</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              {[0.25, 0.5, 1].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWeightInput((w) => String(round2((Number(w) || 0) + preset)))}
                  className="px-3 py-1.5 rounded-full bg-mist text-xs font-medium text-ink"
                >
                  +{preset}kg
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-11 h-11 rounded-full bg-mist flex items-center justify-center text-ink active:scale-95 transition-transform"
            >
              <PiMinusBold />
            </button>
            <span className="font-display text-3xl w-12 text-center figures">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <PiPlusBold />
            </button>
          </div>
        )}

        <Button
          full
          size="lg"
          disabled={!canConfirm}
          onClick={() => {
            onConfirm(product, isWeightPriced ? weight : qty)
            onClose()
          }}
        >
          {canConfirm ? `Add to cart · ${formatINR(amount)}` : 'Enter a weight'}
        </Button>
      </div>
    </div>
  )
}
