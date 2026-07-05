import { useEffect, useState } from 'react'
import { PiXBold } from 'react-icons/pi'
import Button from '../ui/Button'

const blankForm = {
  name: '',
  category: '',
  barcode: '',
  price: '',
  gst: '5',
  stock: '0',
  lowStockLimit: '10',
}

export default function ProductFormModal({ open, onClose, onSubmit, categories, initial }) {
  const [form, setForm] = useState(blankForm)

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        category: initial.category,
        barcode: initial.barcode || '',
        price: initial.price,
        gst: initial.gst,
        stock: initial.stock,
        lowStockLimit: initial.lowStockLimit,
      })
    } else {
      setForm(blankForm)
    }
  }, [initial, open])

  if (!open) return null

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      ...form,
      price: Number(form.price),
      gst: Number(form.gst),
      stock: Number(form.stock),
      lowStockLimit: Number(form.lowStockLimit),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl bg-porcelain rounded-t-[28px] shadow-lift max-h-[88vh] overflow-y-auto p-5 pb-8 space-y-3 animate-[slideUp_0.18s_ease-out]"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-lg text-ink">
            {initial ? 'Edit product' : 'Add product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-ledger"
          >
            <PiXBold size={14} />
          </button>
        </div>

        <Field label="Product name">
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Category">
          <select
            required
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="input"
          >
            <option value="" disabled>Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Barcode">
          <input value={form.barcode} onChange={(e) => update('barcode', e.target.value)} className="input figures" />
        </Field>

        <Field label="Selling price">
          <input type="number" required value={form.price} onChange={(e) => update('price', e.target.value)} className="input figures" />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="GST %">
            <input type="number" value={form.gst} onChange={(e) => update('gst', e.target.value)} className="input figures" />
          </Field>
          <Field label="Stock">
            <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="input figures" />
          </Field>
          <Field label="Low stock at">
            <input type="number" value={form.lowStockLimit} onChange={(e) => update('lowStockLimit', e.target.value)} className="input figures" />
          </Field>
        </div>

        <Button type="submit" full size="lg" className="mt-2">
          {initial ? 'Save changes' : 'Add product'}
        </Button>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ledger mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}
