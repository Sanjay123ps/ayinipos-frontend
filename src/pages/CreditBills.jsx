import { useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { PiCreditCardDuotone } from 'react-icons/pi'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import CloseCreditSheet from '../components/creditbills/CloseCreditSheet'
import { getCreditBills, closeCreditBill } from '../services/api'
import { formatINR } from '../utils/currency'

const tabs = [
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
]

export default function CreditBills() {
  const [tab, setTab] = useState('pending')
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [closingBill, setClosingBill] = useState(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCreditBills(tab)
      .then(setBills)
      .finally(() => setLoading(false))
  }, [tab])

  const outstandingTotal = tab === 'pending' ? bills.reduce((sum, b) => sum + b.total, 0) : 0

  async function handleConfirmClose(billNo, closedMode) {
    setClosing(true)
    try {
      await closeCreditBill(billNo, closedMode)
      toast.success(`${billNo} marked as paid via ${closedMode}`)
      setBills((prev) => prev.filter((b) => b.id !== billNo))
      setClosingBill(null)
    } catch {
      toast.error('Could not close this bill')
    } finally {
      setClosing(false)
    }
  }

  return (
    <div className="px-4">
      <TopBar title="Credit Bills" subtitle="Pending & paid credit sales" backTo="/more" />

      {tab === 'pending' && bills.length > 0 && (
        <Card className="mb-4 flex items-center gap-3 bg-turmeric-50 border border-turmeric-500/20">
          <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-turmeric-600">
            <PiCreditCardDuotone size={20} />
          </span>
          <div className="flex-1">
            <p className="text-xs text-ledger">Total outstanding</p>
            <p className="font-display text-xl text-ink figures">{formatINR(outstandingTotal)}</p>
          </div>
        </Card>
      )}

      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              'flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors',
              tab === t.key ? 'bg-emerald-600 text-white' : 'bg-white text-ledger'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {loading && <p className="text-sm text-ledger text-center py-10">Loading…</p>}
        {!loading && bills.length === 0 && (
          <p className="text-sm text-ledger text-center py-10">
            No {tab} credit bills.
          </p>
        )}
        {bills.map((bill) => (
          <Card key={bill.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium text-ink figures">{bill.id}</p>
                {bill.creditStatus === 'paid' && bill.creditClosedMode && (
                  <Badge variant="success">via {bill.creditClosedMode}</Badge>
                )}
              </div>
              <p className="text-xs text-ledger truncate">
                {bill.customerName || 'Walk-in'}
                {bill.customerMobile && ` · ${bill.customerMobile}`}
                {' · '}
                {new Date(bill.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-base text-ink figures">{formatINR(bill.total)}</p>
            </div>
            {tab === 'pending' && (
              <Button size="sm" variant="accent" onClick={() => setClosingBill(bill)}>
                Close
              </Button>
            )}
          </Card>
        ))}
      </div>

      <CloseCreditSheet
        bill={closingBill}
        onClose={() => setClosingBill(null)}
        onConfirm={handleConfirmClose}
        closing={closing}
      />
    </div>
  )
}
