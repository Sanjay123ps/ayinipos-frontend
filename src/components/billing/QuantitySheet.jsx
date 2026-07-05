import { useEffect, useState } from 'react'
import { PiMinusBold, PiPlusBold, PiXBold } from 'react-icons/pi'
import Button from '../ui/Button'
import { formatINR } from '../../utils/currency'

export default function QuantitySheet({ product, onConfirm, onClose }) {
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setQty(1)
  }, [product])

  if (!product) return null

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
          <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl">
            {product.emoji}
          </div>
          <div>
            <p className="font-medium text-ink">{product.name}</p>
            <p className="text-sm text-ledger figures">{formatINR(product.price)} · GST {product.gst}%</p>
          </div>
        </div>

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

        <Button
          full
          size="lg"
          onClick={() => {
            onConfirm(product, qty)
            onClose()
          }}
        >
          Add to cart · {formatINR(product.price * qty)}
        </Button>
      </div>
    </div>
  )
}
