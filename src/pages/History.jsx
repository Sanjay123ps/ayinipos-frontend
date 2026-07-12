import { useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { PiMagnifyingGlassBold, PiDownloadSimpleBold, PiCaretRightBold, PiTrashSimpleBold, PiCheckCircleFill, PiCircle, PiXBold } from 'react-icons/pi'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import BillDetailSheet from '../components/history/BillDetailSheet'
import { getBills, getBill, deleteBill, bulkDeleteBills, exportBills } from '../services/api'
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
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkDeleting, setBulkDeleting] = useState(false)

  // customFrom/customTo come from <input type="date"> as plain local
  // "YYYY-MM-DD" strings. Appending "Z" would parse that as UTC midnight
  // instead of local midnight — for IST (UTC+5:30) that quietly clips the
  // first 5.5 hours of the start date out of the range. Appending
  // "T00:00:00" (from) / "T23:59:59.999" (to) with no "Z" makes the JS Date
  // parser treat them as local midnight / local end-of-day instead, the
  // same way getPresetRange builds both bounds for the presets below.
  const range =
    activePreset === 'custom'
      ? {
          from: customFrom ? new Date(`${customFrom}T00:00:00`).toISOString() : null,
          to: customTo ? new Date(`${customTo}T23:59:59.999`).toISOString() : null,
        }
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

  function toggleSelectMode() {
    setSelectMode((prev) => !prev)
    setSelectedIds([])
  }

  function toggleSelected(billNo) {
    setSelectedIds((prev) =>
      prev.includes(billNo) ? prev.filter((id) => id !== billNo) : [...prev, billNo]
    )
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => (prev.length === bills.length ? [] : bills.map((b) => b.id)))
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Delete ${selectedIds.length} bill${selectedIds.length === 1 ? '' : 's'}? Stock will be restored for each.`)) {
      return
    }
    setBulkDeleting(true)
    try {
      const { deleted, notFound } = await bulkDeleteBills(selectedIds)
      if (deleted.length) {
        setBills((prev) => prev.filter((b) => !deleted.includes(b.id)))
        setTotal((t) => t - deleted.length)
        toast.success(`${deleted.length} bill${deleted.length === 1 ? '' : 's'} deleted`)
      }
      if (notFound.length) {
        toast.error(`${notFound.length} bill${notFound.length === 1 ? '' : 's'} could not be found`)
      }
      setSelectedIds([])
      setSelectMode(false)
    } catch {
      toast.error('Could not delete selected bills')
    } finally {
      setBulkDeleting(false)
    }
  }

  return (
    <div className="px-4">
      <TopBar
        title="History"
        subtitle={selectMode ? `${selectedIds.length} selected` : `${total} bill${total === 1 ? '' : 's'}`}
        backTo="/more"
        right={
          <div className="flex items-center gap-2">
            {!selectMode && (
              <button
                onClick={handleExport}
                className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-emerald-700 active:scale-95 transition-transform"
                aria-label="Export bills"
              >
                <PiDownloadSimpleBold size={16} />
              </button>
            )}
            <button
              onClick={toggleSelectMode}
              className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-ledger active:scale-95 transition-transform"
              aria-label={selectMode ? 'Cancel selection' : 'Select bills'}
            >
              {selectMode ? <PiXBold size={16} /> : <PiCheckCircleFill size={16} />}
            </button>
          </div>
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

      {selectMode && bills.length > 0 && (
        <button
          onClick={toggleSelectAll}
          className="w-full flex items-center gap-2 text-sm text-emerald-700 font-medium mb-2.5 px-0.5"
        >
          {selectedIds.length === bills.length ? <PiCheckCircleFill size={18} /> : <PiCircle size={18} />}
          {selectedIds.length === bills.length ? 'Deselect all' : 'Select all'}
        </button>
      )}

      <div className="space-y-2.5 pb-24">
        {loading && <p className="text-sm text-ledger text-center py-10">Loading…</p>}
        {!loading && bills.length === 0 && (
          <p className="text-sm text-ledger text-center py-10">No bills in this range.</p>
        )}
        {bills.map((bill) => {
          const checked = selectedIds.includes(bill.id)
          return (
            <button
              key={bill.id}
              onClick={() => (selectMode ? toggleSelected(bill.id) : openBill(bill.id))}
              className="w-full text-left"
            >
              <Card className="flex items-center gap-3">
                {selectMode && (
                  <span className="shrink-0 text-emerald-700">
                    {checked ? <PiCheckCircleFill size={20} /> : <PiCircle size={20} className="text-mist" />}
                  </span>
                )}
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
                {!selectMode && <PiCaretRightBold className="text-ledger shrink-0" size={14} />}
              </Card>
            </button>
          )
        })}
      </div>

      <BillDetailSheet
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {selectMode && selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-mist shadow-soft z-20">
          <Button
            full
            variant="danger"
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
          >
            <PiTrashSimpleBold size={16} />
            {bulkDeleting
              ? 'Deleting…'
              : `Delete ${selectedIds.length} bill${selectedIds.length === 1 ? '' : 's'}`}
          </Button>
        </div>
      )}
    </div>
  )
}
