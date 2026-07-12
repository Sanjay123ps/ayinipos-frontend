import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getSettings, saveSettings } from '../services/api'

const logoOptions = ['🌿', '🛒', '🏪', '🌾', '🥥', '🧺']

export default function Settings() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSettings().then(setForm)
  }, [])

  if (!form) return null

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSettings(form)
      toast.success('Settings saved')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4">
      <TopBar title="Settings" subtitle="Store details & preferences" backTo="/more" />

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Store logo</label>
            <div className="flex gap-2">
              {logoOptions.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => update('logoEmoji', emoji)}
                  className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors',
                    form.logoEmoji === emoji ? 'bg-emerald-600' : 'bg-porcelain'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Store name</label>
            <input value={form.storeName} onChange={(e) => update('storeName', e.target.value)} className="input" />
          </div>

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">GST number</label>
            <input value={form.gstNumber || ''} onChange={(e) => update('gstNumber', e.target.value)} className="input figures" />
          </div>

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Address</label>
            <textarea
              value={form.address || ''}
              onChange={(e) => update('address', e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Bill footer</label>
            <textarea
              value={form.billFooter || ''}
              onChange={(e) => update('billFooter', e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ledger mb-1.5 block">Default GST rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={form.gstDefaultRate}
              onChange={(e) => update('gstDefaultRate', Number(e.target.value) || 0)}
              className="input figures"
            />
            <p className="text-xs text-ledger mt-1.5">Applied to new products unless a different rate is set on the product itself.</p>
          </div>

          <Button type="submit" full size="lg" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
