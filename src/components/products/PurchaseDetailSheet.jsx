import { PiXBold, PiTrashSimpleBold, PiPencilSimpleBold } from 'react-icons/pi'
import Button from '../ui/Button'

export default function PurchaseDetailSheet({ purchase, onClose, onEdit, onDelete, deleting }) {
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

          <div className="bg-white rounded-2xl shadow-soft p-4 space-y-2 text-sm">
            {purchase.items.map((item, idx) => (
              <div key={idx} className="flex justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-ink truncate">{item.productName}</p>
                </div>
                <span className="figures shrink-0 text-ledger">{item.quantity} {item.unit}</span>
              </div>
            ))}
          </div>

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
