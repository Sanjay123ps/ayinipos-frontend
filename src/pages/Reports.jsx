import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import ReportCard from '../components/reports/ReportCard'
import { formatINR } from '../utils/currency'
import { getPresetRange } from '../utils/dateRanges'
import {
  getSalesTrend,
  getDashboardStats,
  getPurchases,
  getBestSellers,
  getProducts,
} from '../services/api'

const ranges = ['Daily', 'Weekly', 'Monthly', 'Custom']
const PRESET_BY_RANGE = { Daily: 'today', Weekly: 'week', Monthly: 'month' }

export default function Reports() {
  const [range, setRange] = useState('Weekly')
  const [trend, setTrend] = useState([])
  const [stats, setStats] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [products, setProducts] = useState([])
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  // Resolves the active tab (or custom picker) into real from/to bounds.
  // Custom builds full local-day ISO instants the same safe way History.jsx
  // does — see the note there and in utils/dateRanges.js — rather than
  // sending bare "YYYY-MM-DD" strings.
  const { from, to } = useMemo(() => {
    if (range === 'Custom') {
      return {
        from: customFrom ? new Date(`${customFrom}T00:00:00`).toISOString() : null,
        to: customTo ? new Date(`${customTo}T23:59:59.999`).toISOString() : null,
      }
    }
    return getPresetRange(PRESET_BY_RANGE[range])
  }, [range, customFrom, customTo])

  useEffect(() => {
    // Custom range with either date not yet picked: wait rather than firing
    // requests with a one-sided/open range.
    if (range === 'Custom' && (!from || !to)) return

    getSalesTrend({ from, to }).then(setTrend)
    getDashboardStats({ from, to }).then(setStats)
    getPurchases({ from, to, limit: 200 }).then(setPurchases)
    getBestSellers({ from, to }).then(setBestSellers)
  }, [range, from, to])

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  const lowStockCount = products.filter((p) => p.stock <= p.lowStockLimit).length

  return (
    <div className="px-4">
      <TopBar title="Reports" subtitle="Sales, purchases & stock" />

      <div className="flex gap-2 overflow-x-auto scrollbar-none mb-4 -mx-4 px-4">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={clsx(
              'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
              range === r ? 'bg-emerald-600 text-white' : 'bg-white text-ledger'
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {range === 'Custom' && (
        <Card className="mb-4 flex items-center gap-3">
          <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="input figures" />
          <span className="text-ledger text-sm">to</span>
          <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="input figures" />
        </Card>
      )}

      <Card className="mb-4">
        <span className="text-xs font-medium text-ledger mb-2 block">Sales report — {range.toLowerCase()}</span>
        <div className="h-32 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#566359' }} />
              <Tooltip
                formatter={(value) => formatINR(value)}
                contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
              />
              <Bar dataKey="sales" radius={[6, 6, 0, 0]} fill="#1F6F4F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <ReportCard icon="🧾" title="Sales report" value={stats ? formatINR(stats.rangeRevenue) : '—'} sub={`${stats?.rangeOrders ?? '—'} orders`} />
        <ReportCard icon="💰" title="Revenue report" value={stats ? formatINR(stats.totalRevenue) : '—'} sub="all time" />
        <ReportCard icon="📦" title="Purchase history" value={purchases.length} sub="purchase bills" />
        <ReportCard icon="🗃️" title="Stock report" value={lowStockCount} sub="low stock items" />
      </div>

      <Card>
        <span className="text-sm font-semibold text-ink mb-2 block">Best selling products</span>
        <div className="space-y-2">
          {bestSellers.map((b) => (
            <div key={b.name} className="flex items-center justify-between text-sm">
              <span className="text-ink">{b.name}</span>
              <span className="text-ledger figures">{b.units} units · {formatINR(b.revenue)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
