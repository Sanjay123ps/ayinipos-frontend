import { useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { PiMagnifyingGlassBold, PiDownloadSimpleBold, PiCaretRightBold } from 'react-icons/pi'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import BillDetailSheet from '../components/history/BillDetailSheet'
import { getBills, getBill, deleteBill, exportBills } from '../services/api'
import { formatINR } from '../utils/currency'
import { presets, getPresetRange } from '../utils/dateRanges'

const modeBadge = {
  Cash: 'neutral',
  Card: 'neutral',
  UPI: 'success',
  Credit: 'warning',
}

export default function History() {
  const [activePreset, setActivePreset] = useState('today')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [search, setSearch] = useState('')
  const [bills, setBills] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedBill, setSelectedBill] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // customFrom/customTo come from <input type="date"> as plain local
  // "YYYY-MM-DD" strings. Appending "Z" would parse that as UTC midnight
  // instead of local midnight — for IST (UTC+5:30) that quietly clips the
  // first 5.5 hours of the start date out of the range. Appending
  // "T00:00:00" with no "Z" makes the JS Date parser treat it as local
  // midnight instead, same as getPresetRange does for the presets below.
  const range =
    activePreset === 'custom'
      ? { from: customFrom ? new Date(`${customFrom}T00:00:00`).toISOString() : null, to: customTo || null }
      : getPresetRange(activePreset)

  useEffect(() => {
    setLoading(true)
    getBills({ from: range.from, to: range.to, q: search, page: 1, limit: 50 })
      .then((res) => {
        setBills(res.bills)
        setTotal(res.total)
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePreset, customFrom, customTo, search])

  async function openBill(billNo) {
    const bill = await getBill(billNo)
    setSelectedBill(bill)
  }

  async function handleDelete(billNo) {
    setDeleting(true)
    try {
      await deleteBill(billNo)
      toast.success('Bill deleted')
      setSelectedBill(null)
      setBills((prev) => prev.filter((b) => b.id !== billNo))
      setTotal((t) => t - 1)
    } catch {
      toast.error('Could not delete bill')
    } finally {
      setDeleting(false)
    }
  }

  async function handleExport() {
    await exportBills({ from: range.from, to: range.to, q: search })
    toast.success('Export downloaded')
  }

  return (
    <div className="px-4">
      <TopBar
        title="History"
        subtitle={`${total} bill${total === 1 ? '' : 's'}`}
        backTo="/more"
        right={
          <button
            onClick={handleExport}
            className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-emerald-700 active:scale-95 transition-transform"
            aria-label="Export bills"
          >
            <PiDownloadSimpleBold size={16} />
          </button>
        }
      />

      <div className="relative mb-3">
        <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ledger" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by bill no, name or mobile"
          className="w-full rounded-xl border border-mist bg-white pl-10 pr-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none mb-3 -mx-4 px-4 pb-1">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => setActivePreset(p.key)}
            className={clsx(
              'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
              activePreset === p.key ? 'bg-emerald-600 text-white' : 'bg-white text-ledger'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {activePreset === 'custom' && (
        <Card className="mb-3 flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-ledger mb-1 block">From</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="w-full rounded-xl border border-mist bg-porcelain px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 figures"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-ledger mb-1 block">To</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="w-full rounded-xl border border-mist bg-porcelain px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 figures"
            />
          </div>
        </Card>
      )}

      <div className="space-y-2.5">
        {loading && <p className="text-sm text-ledger text-center py-10">Loading…</p>}
        {!loading && bills.length === 0 && (
          <p className="text-sm text-ledger text-center py-10">No bills in this range.</p>
        )}
        {bills.map((bill) => (
          <button key={bill.id} onClick={() => openBill(bill.id)} className="w-full text-left">
            <Card className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-ink figures">{bill.id}</p>
                  <Badge variant={modeBadge[bill.paymentMode] || 'neutral'}>{bill.paymentMode}</Badge>
                </div>
                <p className="text-xs text-ledger truncate">
                  {bill.customerName || 'Walk-in'} · {new Date(bill.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' })} · {bill.items} item{bill.items === 1 ? '' : 's'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-base text-ink figures">{formatINR(bill.total)}</p>
              </div>
              <PiCaretRightBold className="text-ledger shrink-0" size={14} />
            </Card>
          </button>
        ))}
      </div>

      <BillDetailSheet
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </div>
  )
}
