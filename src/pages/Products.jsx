import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { PiMagnifyingGlassBold, PiPlusBold } from 'react-icons/pi'
import TopBar from '../components/nav/TopBar'
import ProductRow from '../components/products/ProductRow'
import ProductFormModal from '../components/products/ProductFormModal'
import PurchaseTab from '../components/products/PurchaseTab'
import InventoryTab from '../components/products/InventoryTab'
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services/api'

const tabs = ['Catalog', 'Purchase', 'Inventory']

export default function Products() {
  const [tab, setTab] = useState('Catalog')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  function refresh() {
    getProducts().then(setProducts)
    getCategories().then(setCategories)
  }
  useEffect(refresh, [])

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  )

  async function handleSubmit(payload) {
    if (editing) {
      await updateProduct(editing.id, payload)
      toast.success('Product updated')
    } else {
      await createProduct(payload)
      toast.success('Product added')
    }
    setModalOpen(false)
    setEditing(null)
    refresh()
  }

  async function handleDelete(product) {
    if (!window.confirm(`Remove ${product.name} from the catalog?`)) return
    await deleteProduct(product.id)
    toast.success('Product removed')
    refresh()
  }

  return (
    <div className="px-4">
      <TopBar
        title="Products"
        subtitle="Catalog, purchases & stock"
        right={
          tab === 'Catalog' && (
            <button
              onClick={() => {
                setEditing(null)
                setModalOpen(true)
              }}
              className="w-9 h-9 rounded-full bg-emerald-600 text-white shadow-soft flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Add product"
            >
              <PiPlusBold size={16} />
            </button>
          )
        }
      />

      <div className="flex gap-2 mb-4 bg-white rounded-2xl p-1.5 shadow-soft">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'flex-1 rounded-xl py-2 text-sm font-medium transition-colors',
              tab === t ? 'bg-emerald-600 text-white' : 'text-ledger'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Catalog' && (
        <div className="space-y-3">
          <div className="relative">
            <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="input pl-10"
            />
          </div>
          <div className="space-y-2">
            {filtered.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                onEdit={(prod) => {
                  setEditing(prod)
                  setModalOpen(true)
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {tab === 'Purchase' && <PurchaseTab />}
      {tab === 'Inventory' && <InventoryTab />}

      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
        categories={categories}
        initial={editing}
      />
    </div>
  )
}
