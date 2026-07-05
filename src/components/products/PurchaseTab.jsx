import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PiMagnifyingGlassBold, PiPlusBold, PiTrashSimpleBold, PiDownloadSimpleBold } from 'react-icons/pi'
import Button from '../ui/Button'
import Card from '../ui/Card'
import ProductFormModal from './ProductFormModal'
import PurchaseDetailSheet from './PurchaseDetailSheet'
import {
  getProducts,
  getCategories,
  getSuppliers,
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
  exportPurchases,
  createProduct,
} from '../../services/api'

const today = () => new Date().toISOString().slice(0, 10)

export default function PurchaseTab() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [history, setHistory] = useState([])

  const [query, setQuery] = useState('')
  const [showNewProduct, setShowNewProduct] = useState(false)

  const [editingBillNo, setEditingBillNo] = useState(null)
  const [supplierName, setSupplierName] = useState('')
  const [invoiceNo, setInvoiceNo] = useState('')
  const [date, setDate] = useState(today())
  const [lines, setLines] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const [viewingPurchase, setViewingPurchase] = useState(null)
  const [deleting, setDeleting] = useState(false)

  function refresh() {
    getProducts().then(setProducts)
    getCategories().then(setCategories)
    getSuppliers().then(setSuppliers)
    getPurchases().then(setHistory)
  }

  useEffect(refresh, [])

  const matches = useMemo(() => {
    if (!query) return []
    return products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
  }, [products, query])

  function addLine(product) {
    setLines((prev) => {
      const existingIdx = prev.findIndex((l) => l.productId === product.id)
      if (existingIdx > -1) {
        return prev.map((l, i) => (i === existingIdx ? { ...l, quantity: Number(l.quantity || 0) + 1 } : l))
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          unit: 'pcs',
          quantity: 1,
        },
      ]
    })
    setQuery('')
  }

  function updateLine(idx, field, value) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)))
  }

  function removeLine(idx) {
    setLines((prev) => prev.filter((_, i) => i !== idx))
  }

  const totalQuantity = useMemo(() => lines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0), [lines])

  function resetForm() {
    setEditingBillNo(null)
    setSupplierName('')
    setInvoiceNo('')
    setDate(today())
    setLines([])
    setQuery('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (lines.length === 0) {
      toast.error('Add at least one product')
      return
    }
    if (!supplierName) {
      toast.error('Enter a supplier name')
      return
    }
    const items = lines.map((l) => ({
      productId: l.productId,
      productName: l.productName,
      unit: l.unit,
      quantity: Number(l.quantity) || 0,
    }))

    setSubmitting(true)
    try {
      if (editingBillNo) {
        await updatePurchase(editingBillNo, { supplier: supplierName, invoiceNo, date, items })
        toast.success('Purchase bill updated')
      } else {
        await createPurchase({ supplier: supplierName, invoiceNo, date, items })
        toast.success('Purchase recorded and stock updated')
      }
      resetForm()
      refresh()
    } catch (err) {
      toast.error(err.message || 'Could not save purchase')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleNewProduct(payload) {
    await createProduct(payload)
    toast.success('Product added to catalog')
    setShowNewProduct(false)
    refresh()
  }

  async function openPurchase(billNo) {
    const purchase = await getPurchase(billNo)
    setViewingPurchase(purchase)
  }

  function startEdit(purchase) {
    setEditingBillNo(purchase.id)
    setSupplierName(purchase.supplier)
    setInvoiceNo(purchase.invoiceNo || '')
    setDate(purchase.date)
    setLines(
      purchase.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        unit: i.unit,
        quantity: i.quantity,
      }))
    )
    setViewingPurchase(null)
  }

  async function handleDelete(billNo) {
    setDeleting(true)
    try {
      await deletePurchase(billNo)
      toast.success('Purchase deleted, stock reversed')
      setViewingPurchase(null)
      refresh()
    } catch {
      toast.error('Could not delete purchase')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-3">
          {editingBillNo && (
            <div className="flex items-center justify-between bg-turmeric-50 rounded-xl px-3.5 py-2 text-xs text-turmeric-700">
              <span>Editing {editingBillNo}</span>
              <button type="button" onClick={resetForm} className="font-medium underline">
                Cancel
              </button>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Add product</label>
            <div className="relative">
              <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger" size={14} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products to add…"
                className="input pl-9"
              />
            </div>
            {query && (
              <div className="mt-1.5 bg-white rounded-xl shadow-soft overflow-hidden divide-y divide-mist">
                {matches.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => addLine(p)}
                    className="w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between"
                  >
                    <span>{p.emoji} {p.name}</span>
                    <span className="text-ledger figures">{p.stock} in stock</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowNewProduct(true)}
                  className="w-full text-left px-3.5 py-2.5 text-sm flex items-center gap-2 text-emerald-700 font-medium"
                >
                  <PiPlusBold size={12} /> Add "{query}" as a new product
                </button>
              </div>
            )}
          </div>

          {lines.length > 0 && (
            <div className="space-y-2">
              {lines.map((line, idx) => (
                <div key={idx} className="bg-porcelain rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink truncate pr-2">{line.productName}</p>
                    <button type="button" onClick={() => removeLine(idx)} className="text-chili-600 shrink-0">
                      <PiTrashSimpleBold size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-ledger block mb-1">Qty</label>
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => updateLine(idx, 'quantity', e.target.value)}
                        className="input py-1.5 text-sm figures"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-ledger block mb-1">Unit</label>
                      <input
                        value={line.unit}
                        onChange={(e) => updateLine(idx, 'unit', e.target.value)}
                        className="input py-1.5 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ledger mb-1.5 block">Supplier</label>
              <input
                list="suppliers"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="input"
              />
              <datalist id="suppliers">
                {suppliers.map((s) => <option key={s.id} value={s.name} />)}
              </datalist>
            </div>
            <div>
              <label className="text-xs font-medium text-ledger mb-1.5 block">Invoice number</label>
              <input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="input" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input figures" />
          </div>

          <div className="bg-porcelain rounded-xl px-3.5 py-2.5 space-y-1 text-sm">
            <div className="flex justify-between font-display text-lg text-ink">
              <span>Total quantity</span>
              <span className="figures">{totalQuantity}</span>
            </div>
          </div>

          <Button type="submit" full size="lg" disabled={submitting}>
            {submitting ? 'Saving…' : editingBillNo ? 'Update purchase' : 'Submit purchase'}
          </Button>
        </form>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-sm font-semibold text-ink">Purchase history</p>
          <button onClick={() => exportPurchases()} className="text-emerald-700 flex items-center gap-1 text-xs font-medium">
            <PiDownloadSimpleBold size={13} /> Export
          </button>
        </div>
        <div className="space-y-2">
          {history.map((h) => (
            <button key={h.id} onClick={() => openPurchase(h.id)} className="w-full text-left">
              <Card padded className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{h.supplier}</p>
                  <p className="text-xs text-ledger">{h.invoiceNo} · {h.date} · {h.items} item{h.items === 1 ? '' : 's'}</p>
                </div>
                <span className="font-display text-sm text-ink figures">{h.totalQuantity} units</span>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <ProductFormModal
        open={showNewProduct}
        onClose={() => setShowNewProduct(false)}
        onSubmit={handleNewProduct}
        categories={categories}
      />

      <PurchaseDetailSheet
        purchase={viewingPurchase}
        onClose={() => setViewingPurchase(null)}
        onEdit={startEdit}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </div>
  )
}
