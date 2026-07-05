import { PiWhatsappLogoBold, PiPlusBold } from 'react-icons/pi'
import Button from '../ui/Button'
import { formatINR } from '../../utils/currency'

export default function BillReceipt({ bill, storeName = 'Ayini Home Products', onNewBill }) {
  if (!bill) return null

  function sendToWhatsApp() {
    const lines = bill.items.map(
      (i) => `${i.name} x${i.qty} - ${formatINR(i.price * i.qty)}`
    )
    const message = [
      `*${storeName}*`,
      `Bill: ${bill.id}`,
      '',
      ...lines,
      '',
      `Subtotal: ${formatINR(bill.totals.subtotal)}`,
      `GST: ${formatINR(bill.totals.gstAmount)}`,
      bill.totals.discountAmount > 0 ? `Discount: -${formatINR(bill.totals.discountAmount)}` : null,
      `*Total: ${formatINR(bill.totals.total)}*`,
      '',
      `Paid via ${bill.paymentMode}. Thank you for shopping with us!`,
    ]
      .filter(Boolean)
      .join('\n')

    const phone = bill.customerMobile ? `91${bill.customerMobile}` : ''
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/50" />
      <div className="relative w-full max-w-sm bg-white rounded-card shadow-lift p-6 perforated-bottom">
        <div className="text-center mb-4">
          <p className="text-2xl mb-1">🌿</p>
          <p className="font-display text-lg text-ink">{storeName}</p>
          <p className="text-xs text-ledger figures">{bill.id}</p>
        </div>

        <div className="space-y-1.5 text-sm mb-4 max-h-40 overflow-y-auto">
          {bill.items.map((i) => (
            <div key={i.id} className="flex justify-between text-ledger">
              <span className="truncate pr-2">{i.name} x{i.qty}</span>
              <span className="figures shrink-0">{formatINR(i.price * i.qty)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-mist pt-3 space-y-1 text-sm mb-5">
          <div className="flex justify-between text-ledger">
            <span>Subtotal</span>
            <span className="figures">{formatINR(bill.totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ledger">
            <span>GST</span>
            <span className="figures">{formatINR(bill.totals.gstAmount)}</span>
          </div>
          <div className="flex justify-between font-display text-xl text-ink pt-1">
            <span>Total</span>
            <span className="figures">{formatINR(bill.totals.total)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button full variant="accent" onClick={sendToWhatsApp}>
            <PiWhatsappLogoBold size={18} /> Send bill to WhatsApp
          </Button>
          <Button full variant="ghost" onClick={onNewBill}>
            <PiPlusBold size={14} /> Start new bill
          </Button>
        </div>
      </div>
    </div>
  )
}
