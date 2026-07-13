import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { PiMagnifyingGlassBold } from 'react-icons/pi'
import TopBar from '../components/nav/TopBar'
import ProductGrid from '../components/billing/ProductGrid'
import QuantitySheet from '../components/billing/QuantitySheet'
import FloatingCartBar from '../components/billing/FloatingCartBar'
import CartDrawer from '../components/billing/CartDrawer'
import BillReceipt from '../components/billing/BillReceipt'
import { useCart } from '../context/CartContext'
import { getProducts, getCategories, createBill } from '../services/api'

export default function Billing() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sheetProduct, setSheetProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [generating, setGenerating] = useState(false)
  const [completedBill, setCompletedBill] = useState(null)

  const { items, addItem, totals, discountPercent, customerMobile, customerName, clearCart } = useCart()

  useEffect(() => {
    getProducts().then(setProducts)
    getCategories().then((c) => setCategories(['All', ...c]))
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, search])

  async function handleGenerateBill() {
    setGenerating(true)
    try {
      const bill = await createBill({
        // Only id/qty travel over the wire — the server re-reads price,
        // gst, name, and stock straight from the products table for every
        // line anyway (see saleModel.js), so shipping the full cart objects
        // (which can carry a ~30-100KB base64 product photo each) was pure
        // waste and is what was tripping the body-size limit.
        items: items.map(({ id, qty }) => ({ id, qty })),
        discountPercent,
        customerMobile,
        customerName,
        paymentMode,
        totals,
      })
      setCartOpen(false)
      setCompletedBill(bill)
    } catch (err) {
      toast.error('Could not generate the bill')
    } finally {
      setGenerating(false)
    }
  }

  function handleNewBill() {
    clearCart()
    setCompletedBill(null)
    getProducts().then(setProducts)
  }

  return (
    <div className="px-4">
      <TopBar title="Billing" subtitle="Tap a product to add it" />

      <div className="relative mb-3">
        <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="w-full rounded-xl border border-mist bg-white pl-10 pr-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none mb-4 -mx-4 px-4 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
              activeCategory === cat ? 'bg-emerald-600 text-white' : 'bg-white text-ledger'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <ProductGrid products={filtered} onSelect={setSheetProduct} />

      <FloatingCartBar itemCount={totals.itemCount} total={totals.total} onOpen={() => setCartOpen(true)} />

      <QuantitySheet
        product={sheetProduct}
        onClose={() => setSheetProduct(null)}
        onConfirm={(product, qty) => {
          addItem(product, qty)
          toast.success(`${product.name} added`)
        }}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        paymentMode={paymentMode}
        onPaymentMode={setPaymentMode}
        onGenerateBill={handleGenerateBill}
        generating={generating}
      />

      <BillReceipt bill={completedBill} onNewBill={handleNewBill} />
    </div>
  )
}

