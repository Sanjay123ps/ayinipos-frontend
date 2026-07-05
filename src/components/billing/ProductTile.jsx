import clsx from 'clsx'
import { formatINR } from '../../utils/currency'

export default function ProductTile({ product, onSelect }) {
  const outOfStock = product.stock <= 0
  const low = !outOfStock && product.stock <= product.lowStockLimit

  return (
    <button
      onClick={() => !outOfStock && onSelect(product)}
      disabled={outOfStock}
      className={clsx(
        'text-left bg-white rounded-2xl shadow-soft p-3 flex flex-col gap-1.5 transition-transform active:scale-[0.97]',
        outOfStock && 'opacity-50'
      )}
    >
      <div className="w-full aspect-square rounded-xl bg-emerald-50 flex items-center justify-center text-3xl">
        {product.emoji}
      </div>
      <p className="text-sm font-medium text-ink leading-snug line-clamp-2">{product.name}</p>
      <div className="flex items-center justify-between">
        <span className="font-display text-sm text-ink figures">{formatINR(product.price)}</span>
        {outOfStock ? (
          <span className="text-[10px] font-medium text-chili-600">Out of stock</span>
        ) : low ? (
          <span className="text-[10px] font-medium text-turmeric-600">{product.stock} left</span>
        ) : null}
      </div>
    </button>
  )
}
