import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  PiMagnifyingGlassBold,
  PiPlusBold,
  PiTrashSimpleBold,
  PiDownloadSimpleBold,
  PiImageBold,
  PiXBold,
} from 'react-icons/pi'
import Button from '../ui/Button'
import Card from '../ui/Card'
import ProductAvatar from '../ui/ProductAvatar'
import ProductFormModal from './ProductFormModal'
import PurchaseDetailSheet from './PurchaseDetailSheet'
import { validateAndReadBillImage } from '../../utils/image'
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

// Supported purchase quantity units — shown in a dropdown next to Quantity,
// per product line. "Nos" is the default for a new line.
export const PURCHASE_UNITS = ['Nos', 'Kg', 'g', 'L', 'ml', 'Pack', 'Box', 'Bag', 'Bundle']

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(n) || 0)

function blankLine(overrides) {
  return { productId: null, productName: '', unit: 'Nos', quantity: 1, purchasePrice: '', productType: 'manual', ...overrides }
}

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
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Bill image: `billImage` holds the current data URL (or '' if none).
  // `billImageTouched` tracks whether the user actually changed it during
  // this edit session — an untouched image on an edit is left alone on the
  // backend rather than being resent every time.
  const [billImage, setBillImage] = useState('')
  const [billImageTouched, setBillImageTouched] = useState(false)
  const [billImageError, setBillImageError] = useState('')
  const [billImageProcessing, setBillImageProcessing] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

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
          unit: 'Nos',
          quantity: 1,
          purchasePrice: '',
          productType: 'catalog',
        },
      ]
    })
    setQuery('')
  }

  // Manual/non-catalog line — for supplier products that aren't meant for
  // sale (packing materials, transport charges, etc.). Stored only inside
  // this purchase bill; never creates a row in the product catalog and
  // never touches inventory.
  function addManualLine(name) {
    setLines((prev) => [...prev, blankLine({ productName: name })])
    setQuery('')
  }

  function updateLine(idx, field, value) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)))
  }

  function removeLine(idx) {
    setLines((prev) => prev.filter((_, i) => i !== idx))
  }

  const totalQuantity = useMemo(() => lines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0), [lines])
  const billTotal = useMemo(
    () => lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.purchasePrice) || 0), 0),
    [lines]
  )

  function resetForm() {
    setEditingBillNo(null)
    setSupplierName('')
    setInvoiceNo('')
    setDate(today())
    setNotes('')
    setLines([])
    setQuery('')
    setBillImage('')
    setBillImageTouched(false)
    setBillImageError('')
  }

  async function handleBillImageChange(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // lets the same file be re-selected later if removed
    if (!file) return
    setBillImageError('')
    setBillImageProcessing(true)
    try {
      const dataUrl = await validateAndReadBillImage(file)
      setBillImage(dataUrl)
      setBillImageTouched(true)
    } catch (err) {
      setBillImageError(err.message || 'Could not read that image — please try another file.')
    } finally {
      setBillImageProcessing(false)
    }
  }

  function removeBillImage() {
    setBillImage('')
    setBillImageTouched(true)
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
    for (const l of lines) {
      if (!l.productName?.trim()) {
        toast.error('Every line needs a product name')
        return
      }
      if (!l.quantity || Number(l.quantity) <= 0) {
        toast.error('Every line needs a valid quantity')
        return
      }
    }

    const items = lines.map((l) => ({
      productId: l.productId,
      productName: l.productName,
      unit: l.unit,
      quantity: Number(l.quantity) || 0,
      purchasePrice: l.purchasePrice === '' ? 0 : Number(l.purchasePrice),
    }))

    const payload = {
      supplier: supplierName,
      invoiceNo,
      date,
      items,
      notes,
      ...(billImageTouched ? { billImage } : {}),
    }

    setSubmitting(true)
    try {
      if (editingBillNo) {
        await updatePurchase(editingBillNo, payload)
        toast.success('Purchase bill updated')
      } else {
        await createPurchase(payload)
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
    setNotes(purchase.notes || '')
    setLines(
      purchase.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        unit: i.unit,
        quantity: i.quantity,
        purchasePrice: i.purchasePrice ?? '',
        productType: i.productType || (i.productId ? 'catalog' : 'manual'),
      }))
    )
    setBillImage(purchase.billImage || '')
    setBillImageTouched(false)
    setBillImageError('')
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
                placeholder="Search products, or type a supplier item…"
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
                    <span className="flex items-center gap-2 min-w-0">
                      <ProductAvatar product={p} className="w-6 h-6 text-xs" rounded="rounded-md" />
                      <span className="truncate">{p.name}</span>
                    </span>
                    <span className="text-ledger figures">{p.stock} in stock</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => addManualLine(query)}
                  className="w-full text-left px-3.5 py-2.5 text-sm flex items-center gap-2 text-emerald-700 font-medium"
                >
                  <PiPlusBold size={12} /> Add "{query}" as one-time item (not for sale)
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProduct(true)}
                  className="w-full text-left px-3.5 py-2.5 text-sm flex items-center gap-2 text-ledger"
                >
                  <PiPlusBold size={12} /> Add "{query}" as a new catalog product
                </button>
              </div>
            )}
          </div>

          {lines.length > 0 && (
            <div className="space-y-2">
              {lines.map((line, idx) => {
                const lineTotal = (Number(line.quantity) || 0) * (Number(line.purchasePrice) || 0)
                return (
                  <div key={idx} className="bg-porcelain rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      {line.productType === 'manual' ? (
                        <input
                          value={line.productName}
                          onChange={(e) => updateLine(idx, 'productName', e.target.value)}
                          placeholder="Item name"
                          className="input py-1.5 text-sm flex-1 min-w-0"
                        />
                      ) : (
                        <p className="text-sm font-medium text-ink truncate pr-2">{line.productName}</p>
                      )}
                      <span
                        className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          line.productType === 'manual'
                            ? 'bg-turmeric-50 text-turmeric-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {line.productType === 'manual' ? 'Manual' : 'Catalog'}
                      </span>
                      <button type="button" onClick={() => removeLine(idx)} className="text-chili-600 shrink-0">
                        <PiTrashSimpleBold size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-ledger block mb-1">Qty</label>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={line.quantity}
                          onChange={(e) => updateLine(idx, 'quantity', e.target.value)}
                          className="input py-1.5 text-sm figures"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-ledger block mb-1">Unit</label>
                        <select
                          value={line.unit}
                          onChange={(e) => updateLine(idx, 'unit', e.target.value)}
                          className="input py-1.5 text-sm"
                        >
                          {PURCHASE_UNITS.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-ledger block mb-1">Purchase price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.purchasePrice}
                          onChange={(e) => updateLine(idx, 'purchasePrice', e.target.value)}
                          placeholder="0.00"
                          className="input py-1.5 text-sm figures"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end text-xs text-ledger">
                      Line total: <span className="ml-1 font-medium text-ink figures">{fmt(lineTotal)}</span>
                    </div>
                  </div>
                )
              })}
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

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Upload bill (optional)</label>
            {billImage ? (
              <div className="flex items-center gap-3 bg-porcelain rounded-xl p-2.5">
                <button
                  type="button"
                  onClick={() => setPreviewImage(billImage)}
                  className="w-14 h-14 rounded-lg overflow-hidden shrink-0"
                >
                  <img src={billImage} alt="Purchase bill" className="w-full h-full object-cover" />
                </button>
                <span className="text-xs text-ledger flex-1">Bill image attached</span>
                <button
                  type="button"
                  onClick={removeBillImage}
                  className="text-xs font-medium text-chili-600 shrink-0 px-2 py-1"
                >
                  Remove
                </button>
                <label className="text-xs font-medium text-emerald-700 shrink-0 px-2 py-1 cursor-pointer">
                  Replace
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleBillImageChange} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="flex items-center gap-2 justify-center border border-dashed border-mist rounded-xl py-4 cursor-pointer text-ledger text-xs">
                <PiImageBold size={16} />
                {billImageProcessing ? 'Processing…' : 'Tap to upload JPG, PNG, or WEBP (max 5 MB)'}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleBillImageChange}
                  className="hidden"
                  disabled={billImageProcessing}
                />
              </label>
            )}
            {billImageError && <p className="text-xs text-chili-600 mt-1">{billImageError}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="input"
              placeholder="e.g. paid partly in advance"
            />
          </div>

          <div className="bg-porcelain rounded-xl px-3.5 py-2.5 space-y-1 text-sm">
            <div className="flex justify-between text-ledger text-xs">
              <span>Total quantity</span>
              <span className="figures">{totalQuantity}</span>
            </div>
            <div className="flex justify-between font-display text-lg text-ink">
              <span>Bill total</span>
              <span className="figures">{fmt(billTotal)}</span>
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
                <div className="text-right">
                  <span className="font-display text-sm text-ink figures block">{fmt(h.totalAmount)}</span>
                  <span className="text-[11px] text-ledger figures">{h.totalQuantity} units</span>
                </div>
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
        onViewImage={setPreviewImage}
      />

      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <div className="absolute inset-0 bg-ink/70" />
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-ink"
          >
            <PiXBold size={16} />
          </button>
          <img src={previewImage} alt="Purchase bill" className="relative max-w-full max-h-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  )
}
