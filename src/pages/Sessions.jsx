import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { formatINR, round2 } from '../utils/currency'
import { getSessions, closeSession } from '../services/api'

const notes = [500, 200, 100, 50, 20, 10]

function nowLabel() {
  return new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function Sessions() {
  const [history, setHistory] = useState([])
  const [openingTime] = useState(nowLabel())
  const [openingCash, setOpeningCash] = useState('')
  const [closingCash, setClosingCash] = useState('')
  const [counts, setCounts] = useState({ 500: '', 200: '', 100: '', 50: '', 20: '', 10: '', coins: '' })
  const [remarks, setRemarks] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getSessions().then(setHistory)
  }, [])

  const totalCash = round2(
    notes.reduce((sum, n) => sum + n * (Number(counts[n]) || 0), 0) + (Number(counts.coins) || 0)
  )
  const difference = round2(totalCash - (Number(closingCash) || 0))

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const record = await closeSession({
        openingTime,
        closingTime: nowLabel(),
        openingCash: Number(openingCash) || 0,
        closingCash: Number(closingCash) || 0,
        denominations: {
          500: Number(counts[500]) || 0,
          200: Number(counts[200]) || 0,
          100: Number(counts[100]) || 0,
          50: Number(counts[50]) || 0,
          20: Number(counts[20]) || 0,
          10: Number(counts[10]) || 0,
          coins: Number(counts.coins) || 0,
        },
        totalCash,
        difference,
        remarks,
      })
      setHistory((h) => [record, ...h])
      toast.success('Session closed')
      setOpeningCash('')
      setClosingCash('')
      setCounts({ 500: '', 200: '', 100: '', 50: '', 20: '', 10: '', coins: '' })
      setRemarks('')
    } catch (err) {
      toast.error('Could not save session')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="px-4">
      <TopBar title="Till sessions" subtitle="Cash counting & handover" backTo="/settings" />

      <Card className="mb-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between text-xs text-ledger bg-porcelain rounded-xl px-3.5 py-2.5">
            <span>Opening time</span>
            <span className="figures">{openingTime}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ledger mb-1.5 block">Opening cash</label>
              <input type="number" value={openingCash} onChange={(e) => setOpeningCash(e.target.value)} className="input figures" />
            </div>
            <div>
              <label className="text-xs font-medium text-ledger mb-1.5 block">Expected closing cash</label>
              <input type="number" value={closingCash} onChange={(e) => setClosingCash(e.target.value)} className="input figures" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Note count</label>
            <div className="grid grid-cols-3 gap-2">
              {notes.map((n) => (
                <div key={n} className="bg-porcelain rounded-xl p-2">
                  <p className="text-[11px] text-ledger mb-1">₹{n} notes</p>
                  <input
                    type="number"
                    min="0"
                    value={counts[n]}
                    onChange={(e) => setCounts((c) => ({ ...c, [n]: e.target.value }))}
                    className="w-full bg-transparent text-sm font-medium figures outline-none"
                    placeholder="0"
                  />
                </div>
              ))}
              <div className="bg-porcelain rounded-xl p-2 col-span-3">
                <p className="text-[11px] text-ledger mb-1">Coins (₹ total)</p>
                <input
                  type="number"
                  min="0"
                  value={counts.coins}
                  onChange={(e) => setCounts((c) => ({ ...c, coins: e.target.value }))}
                  className="w-full bg-transparent text-sm font-medium figures outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-porcelain rounded-xl p-3.5 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-ledger">Total cash counted</span>
              <span className="font-display text-ink figures">{formatINR(totalCash)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ledger">Difference</span>
              <span className={`figures font-medium ${difference === 0 ? 'text-emerald-700' : 'text-chili-600'}`}>
                {difference > 0 ? '+' : ''}{formatINR(difference)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder="Anything worth noting about today's till…"
            />
          </div>

          <Button type="submit" full size="lg" disabled={submitting}>
            {submitting ? 'Closing session…' : 'Close session'}
          </Button>
        </form>
      </Card>

      <p className="text-sm font-semibold text-ink mb-2 px-1">Past sessions</p>
      <div className="space-y-2">
        {history.map((s) => (
          <Card key={s.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-ink">{s.id}</span>
              <Badge variant={s.difference === 0 ? 'success' : 'danger'}>
                {s.difference === 0 ? 'Tallied' : `Diff ${formatINR(s.difference)}`}
              </Badge>
            </div>
            <p className="text-xs text-ledger">{s.openingTime} → {s.closingTime}</p>
            {s.remarks && <p className="text-xs text-ledger mt-1">{s.remarks}</p>}
          </Card>
        ))}
      </div>
    </div>
  )
}
