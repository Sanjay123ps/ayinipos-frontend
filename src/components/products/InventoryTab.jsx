import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PiMinusBold, PiPlusBold } from 'react-icons/pi'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import ProductAvatar from '../ui/ProductAvatar'
import { getProducts, adjustStock } from '../../services/api'

export default function InventoryTab() {
  const [products, setProducts] = useState([])

  function refresh() {
    getProducts().then(setProducts)
  }
  useEffect(refresh, [])

  const available = products.filter((p) => p.stock > p.lowStockLimit).length
  const low = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockLimit).length
  const out = products.filter((p) => p.stock === 0).length

  async function handleAdjust(product, delta) {
    await adjustStock(product.id, delta, delta > 0 ? 'Manual restock' : 'Manual correction')
    toast.success(`${product.name} stock ${delta > 0 ? 'increased' : 'decreased'}`)
    refresh()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-display text-emerald-700 figures">{available}</p>
          <p className="text-xs text-ledger">Available</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-display text-turmeric-600 figures">{low}</p>
          <p className="text-xs text-ledger">Low stock</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-display text-chili-600 figures">{out}</p>
          <p className="text-xs text-ledger">Out of stock</p>
        </Card>
      </div>

      <div className="space-y-2">
        {products.map((p) => {
          const status = p.stock === 0 ? 'danger' : p.stock <= p.lowStockLimit ? 'warning' : 'success'
          return (
            <Card key={p.id} className="flex items-center gap-3">
              <ProductAvatar product={p} className="w-10 h-10 text-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                <Badge variant={status} className="mt-1">{p.stock} in stock</Badge>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleAdjust(p, -1)} className="w-7 h-7 rounded-full bg-mist flex items-center justify-center text-ink">
                  <PiMinusBold size={12} />
                </button>
                <button onClick={() => handleAdjust(p, 1)} className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <PiPlusBold size={12} />
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
