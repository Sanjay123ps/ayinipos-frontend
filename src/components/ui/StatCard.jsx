import Card from './Card'

export default function StatCard({ label, value, icon, accent = 'text-emerald-600', sub }) {
  return (
    <Card className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ledger">{label}</span>
        {icon && <span className={`text-lg ${accent}`}>{icon}</span>}
      </div>
      <span className="font-display text-2xl text-ink leading-none figures">{value}</span>
      {sub && <span className="text-xs text-ledger">{sub}</span>}
    </Card>
  )
}
