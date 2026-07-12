import clsx from 'clsx'

// Shows a product's photo if it has one, falls back to its emoji (if that
// ever gets populated), and finally to a plain initial — so the icon never
// renders as a blank box while a catalog is still getting photos added.
export default function ProductAvatar({ product, className = 'w-11 h-11 text-xl', rounded = 'rounded-xl' }) {
  return (
    <div
      className={clsx(
        'bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden',
        rounded,
        className
      )}
    >
      {product?.image ? (
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      ) : product?.emoji ? (
        product.emoji
      ) : (
        <span className="font-display font-semibold text-emerald-700">
          {product?.name?.trim()?.[0]?.toUpperCase() || '?'}
        </span>
      )}
    </div>
  )
}
