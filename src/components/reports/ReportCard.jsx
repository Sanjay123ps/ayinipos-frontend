import Card from '../ui/Card'

export default function ReportCard({ icon, title, value, sub, onClick }) {
  return (
    <Card
      onClick={onClick}
      className={onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
    >
      <div className="flex items-center gap-2 mb-2 text-ledger">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium">{title}</span>
      </div>
      <p className="font-display text-xl text-ink figures">{value}</p>
      {sub && <p className="text-xs text-ledger mt-0.5">{sub}</p>}
    </Card>
  )
}
