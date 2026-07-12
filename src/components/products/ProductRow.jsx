import { PiPencilSimpleBold, PiTrashSimpleBold } from 'react-icons/pi'
import Badge from '../ui/Badge'
import ProductAvatar from '../ui/ProductAvatar'
import { formatINR } from '../../utils/currency'

export default function ProductRow({ product, onEdit, onDelete }) {
  const status =
    product.stock === 0 ? 'danger' : product.stock <= product.lowStockLimit ? 'warning' : 'success'
  const statusLabel =
    product.stock === 0 ? 'Out of stock' : product.stock <= product.lowStockLimit ? 'Low stock' : 'In stock'

  return (
    <div className="bg-white rounded-2xl shadow-soft p-3 flex items-center gap-3">
      <ProductAvatar product={product} className="w-11 h-11 text-xl" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{product.name}</p>
        <p className="text-xs text-ledger">{product.category}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-display text-ink figures">{formatINR(product.price)}</p>
        <Badge variant={status} className="mt-1">{statusLabel} · {product.stock}</Badge>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0 ml-1">
        <button onClick={() => onEdit(product)} className="w-7 h-7 rounded-full bg-mist flex items-center justify-center text-ink">
          <PiPencilSimpleBold size={12} />
        </button>
        <button onClick={() => onDelete(product)} className="w-7 h-7 rounded-full bg-chili-50 flex items-center justify-center text-chili-600">
          <PiTrashSimpleBold size={12} />
        </button>
      </div>
    </div>
  )
}
