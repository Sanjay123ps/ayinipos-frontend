import { useEffect, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts'
import {
  PiCoinsDuotone,
  PiCalendarCheckDuotone,
  PiShoppingCartDuotone,
  PiPackageDuotone,
  PiTrendUpDuotone,
  PiWarningCircleDuotone,
} from 'react-icons/pi'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { formatINR } from '../utils/currency'
import {
  getDashboardStats,
  getSalesTrend,
  getBestSellers,
  getRecentSales,
  getProducts,
} from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [trend, setTrend] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [recent, setRecent] = useState([])
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    getDashboardStats().then(setStats)
    getSalesTrend().then(setTrend)
    getBestSellers().then(setBestSellers)
    getRecentSales().then(setRecent)
    getProducts().then((products) =>
      setLowStock(products.filter((p) => p.stock <= p.lowStockLimit))
    )
  }, [])

  return (
    <div className="px-4">
      <TopBar title="Good evening" subtitle="Ayini Home Products" />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <StatCard
          label="Today's sales"
          value={stats ? formatINR(stats.todaySales) : '—'}
          icon={<PiCoinsDuotone />}
        />
        <StatCard
          label="Monthly sales"
          value={stats ? formatINR(stats.monthlySales) : '—'}
          icon={<PiCalendarCheckDuotone />}
        />
        <StatCard
          label="Total orders"
          value={stats?.totalOrders ?? '—'}
          icon={<PiShoppingCartDuotone />}
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts ?? '—'}
          icon={<PiPackageDuotone />}
        />
      </div>

      <Card className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-ledger">This week</span>
          <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
            <PiTrendUpDuotone /> +12% vs last week
          </span>
        </div>
        <div className="h-32 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1F6F4F" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1F6F4F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#566359' }}
              />
              <Tooltip
                formatter={(value) => formatINR(value)}
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 12,
                  fontFamily: 'Plus Jakarta Sans',
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#1F6F4F"
                strokeWidth={2}
                fill="url(#salesFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {lowStock.length > 0 && (
        <Card className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <PiWarningCircleDuotone className="text-chili-500" size={18} />
            <span className="text-sm font-semibold text-ink">Low stock alerts</span>
          </div>
          <div className="space-y-2">
            {lowStock.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-ink">{p.emoji} {p.name}</span>
                <Badge variant={p.stock === 0 ? 'danger' : 'warning'}>
                  {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mb-3">
        <span className="text-sm font-semibold text-ink mb-2 block">Best sellers</span>
        <div className="space-y-2.5">
          {bestSellers.map((b, i) => (
            <div key={b.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-turmeric-50 text-turmeric-600 text-xs font-semibold flex items-center justify-center figures">
                  {i + 1}
                </span>
                <span className="text-ink">{b.name}</span>
              </div>
              <span className="text-ledger figures">{b.units} sold</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-3">
        <span className="text-sm font-semibold text-ink mb-2 block">Recent sales</span>
        <div className="divide-y divide-mist">
          {recent.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="text-ink font-medium">{s.id}</p>
                <p className="text-xs text-ledger">{s.time} · {s.items} items · {s.mode}</p>
              </div>
              <span className="font-display text-base text-ink figures">{formatINR(s.total)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
