import { PiShoppingCartSimpleBold } from 'react-icons/pi'
import { formatINR } from '../../utils/currency'

export default function FloatingCartBar({ itemCount, total, onOpen }) {
  if (itemCount === 0) return null

  return (
    <div className="fixed left-0 right-0 z-40" style={{ bottom: '92px' }}>
      <div className="max-w-xl mx-auto px-3">
        <button
          onClick={onOpen}
          className="w-full perforated-top bg-emerald-600 text-white rounded-2xl shadow-lift px-4 py-3.5 flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <PiShoppingCartSimpleBold size={14} />
            </span>
            {itemCount} item{itemCount > 1 ? 's' : ''} in cart
          </span>
          <span className="font-display text-base figures">{formatINR(total)}</span>
        </button>
      </div>
    </div>
  )
}
