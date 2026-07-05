import { useState } from 'react'
import clsx from 'clsx'
import { PiXBold } from 'react-icons/pi'
import Button from '../ui/Button'
import { formatINR } from '../../utils/currency'

const modes = ['Cash', 'Card', 'UPI']

export default function CloseCreditSheet({ bill, onClose, onConfirm, closing }) {
  const [mode, setMode] = useState('Cash')

  if (!bill) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-porcelain rounded-t-[28px] shadow-lift p-5 animate-[slideUp_0.18s_ease-out]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg text-ink">Close credit bill</h2>
            <p className="text-xs text-ledger figures">{bill.id} · {formatINR(bill.total)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-ledger"
          >
            <PiXBold size={14} />
          </button>
        </div>

        <p className="text-xs font-medium text-ledger mb-1.5">Paid via</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={clsx(
                'rounded-xl py-2.5 text-sm font-medium border transition-colors',
                mode === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-ledger border-mist'
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <Button full size="lg" onClick={() => onConfirm(bill.id, mode)} disabled={closing}>
          {closing ? 'Closing…' : `Mark as paid via ${mode}`}
        </Button>
      </div>
    </div>
  )
}
