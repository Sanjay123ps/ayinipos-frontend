import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import ReportCard from '../components/reports/ReportCard'
import { formatINR } from '../utils/currency'
import {
  getSalesTrend,
  getDashboardStats,
  getPurchases,
  getBestSellers,
  getProducts,
} from '../services/api'

const ranges = ['Daily', 'Weekly', 'Monthly', 'Custom']

export default function Reports() {
  const [range, setRange] = useState('Weekly')
  const [trend, setTrend] = useState([])
  const [stats, setStats] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [products, setProducts] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    getSalesTrend().then(setTrend)
    getDashboardStats().then(setStats)
    getPurchases().then(setPurchases)
    getBestSellers().then(setBestSellers)
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
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input figures" />
          <span className="text-ledger text-sm">to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input figures" />
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
        <ReportCard icon="🧾" title="Sales report" value={stats ? formatINR(stats.monthlySales) : '—'} sub={`${stats?.totalOrders ?? '—'} orders`} />
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
