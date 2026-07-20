import { PiXBold, PiTrashSimpleBold, PiPencilSimpleBold, PiImageBold } from 'react-icons/pi'
import Button from '../ui/Button'

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(n) || 0)

export default function PurchaseDetailSheet({ purchase, onClose, onEdit, onDelete, deleting, onViewImage }) {
  if (!purchase) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-porcelain rounded-t-[28px] shadow-lift max-h-[85vh] flex flex-col animate-[slideUp_0.18s_ease-out]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="font-display text-lg text-ink">{purchase.id}</h2>
            <p className="text-xs text-ledger">{purchase.supplier} · {purchase.date}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-ledger"
          >
            <PiXBold size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
          {purchase.invoiceNo && (
            <div className="bg-white rounded-2xl shadow-soft p-4">
              <p className="text-xs text-ledger">Invoice number</p>
              <p className="text-sm font-medium text-ink figures">{purchase.invoiceNo}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-soft p-4 space-y-3 text-sm">
            {purchase.items.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-ink truncate flex items-center gap-1.5">
                    {item.productName}
                    <span
                      className={`shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                        item.productType === 'manual' ? 'bg-turmeric-50 text-turmeric-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {item.productType === 'manual' ? 'Manual' : 'Catalog'}
                    </span>
                  </p>
                  <p className="text-xs text-ledger figures">
                    {item.quantity} {item.unit} × {fmt(item.purchasePrice)}
                  </p>
                </div>
                <span className="figures shrink-0 font-medium text-ink">{fmt(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-ink">Bill total</span>
            <span className="font-display text-lg text-ink figures">{fmt(purchase.totalAmount)}</span>
          </div>

          {purchase.notes && (
            <div className="bg-white rounded-2xl shadow-soft p-4">
              <p className="text-xs text-ledger mb-1">Notes</p>
              <p className="text-sm text-ink">{purchase.notes}</p>
            </div>
          )}

          {purchase.billImage && (
            <button
              type="button"
              onClick={() => onViewImage?.(purchase.billImage)}
              className="w-full flex items-center gap-2 bg-white rounded-2xl shadow-soft p-4 text-sm text-emerald-700 font-medium"
            >
              <PiImageBold size={16} /> View uploaded bill
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => onEdit(purchase)}>
              <PiPencilSimpleBold size={16} /> Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(purchase.id)} disabled={deleting}>
              <PiTrashSimpleBold size={16} /> {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
