import clsx from 'clsx'
import ProductAvatar from '../ui/ProductAvatar'
import { formatINR } from '../../utils/currency'

export default function ProductTile({ product, onSelect }) {
  const outOfStock = product.trackStock !== false && product.stock <= 0
  const low = product.trackStock !== false && !outOfStock && product.stock <= product.lowStockLimit

  return (
    <button
      onClick={() => !outOfStock && onSelect(product)}
      disabled={outOfStock}
      className={clsx(
        'text-left bg-white rounded-2xl shadow-soft p-3 flex flex-col gap-1.5 transition-transform active:scale-[0.97]',
        outOfStock && 'opacity-50'
      )}
    >
      <ProductAvatar product={product} className="w-full aspect-square text-3xl" />
      <p className="text-sm font-medium text-ink leading-snug line-clamp-2">{product.name}</p>
      <div className="flex items-center justify-between">
        <span className="font-display text-sm text-ink figures">
          {formatINR(product.price)}
          {product.unit === 'kg' && <span className="text-ledger text-xs">/kg</span>}
        </span>
        {outOfStock ? (
          <span className="text-[10px] font-medium text-chili-600">Out of stock</span>
        ) : low ? (
          <span className="text-[10px] font-medium text-turmeric-600">{product.stock} left</span>
        ) : null}
      </div>
    </button>
  )
}
