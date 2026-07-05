import { PiXBold, PiTrashSimpleBold } from 'react-icons/pi'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { formatINR } from '../../utils/currency'

const modeBadge = {
  Cash: 'neutral',
  Card: 'neutral',
  UPI: 'success',
  Credit: 'warning',
}

export default function BillDetailSheet({ bill, onClose, onDelete, deleting }) {
  if (!bill) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-porcelain rounded-t-[28px] shadow-lift max-h-[85vh] flex flex-col animate-[slideUp_0.18s_ease-out]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="font-display text-lg text-ink">{bill.id}</h2>
            <p className="text-xs text-ledger">{new Date(bill.createdAt).toLocaleString('en-IN')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-ledger"
          >
            <PiXBold size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
          <div className="bg-white rounded-2xl shadow-soft p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">{bill.customerName || 'Walk-in customer'}</p>
              {bill.customerMobile && <p className="text-xs text-ledger figures">{bill.customerMobile}</p>}
            </div>
            <Badge variant={modeBadge[bill.paymentMode] || 'neutral'}>{bill.paymentMode}</Badge>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 space-y-1.5 text-sm">
            {bill.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-ledger">
                <span className="truncate pr-2">{item.name} x{item.qty}</span>
                <span className="figures shrink-0">{formatINR(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-ledger">
              <span>Subtotal</span>
              <span className="figures">{formatINR(bill.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ledger">
              <span>GST</span>
              <span className="figures">{formatINR(bill.gstAmount)}</span>
            </div>
            {bill.discountAmount > 0 && (
              <div className="flex justify-between text-chili-600">
                <span>Discount</span>
                <span className="figures">-{formatINR(bill.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-display text-lg text-ink pt-1.5 border-t border-mist mt-1.5">
              <span>Total</span>
              <span className="figures">{formatINR(bill.total)}</span>
            </div>
          </div>

          <Button full variant="danger" onClick={() => onDelete(bill.id)} disabled={deleting}>
            <PiTrashSimpleBold size={16} /> {deleting ? 'Deleting…' : 'Delete bill'}
          </Button>
        </div>
      </div>
    </div>
  )
}
