import { useState } from 'react'
import toast from 'react-hot-toast'
import { PiEyeBold, PiEyeSlashBold } from 'react-icons/pi'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { changePassword } from '../services/api'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false })

  function toggleVisible(field) {
    setVisible((v) => ({ ...v, [field]: !v[field] }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setSaving(true)
    try {
      await changePassword({ currentPassword, newPassword })
      toast.success('Password updated')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.message || 'Could not update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4">
      <TopBar title="Change Password" subtitle="Update your login password" backTo="/more" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="on">
          <div>
            <label htmlFor="change-pw-current" className="text-xs font-medium text-ledger mb-1.5 block">Current password</label>
            <div className="relative">
              <input
                id="change-pw-current"
                name="current-password"
                type={visible.current ? 'text' : 'password'}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => toggleVisible('current')}
                aria-label={visible.current ? 'Hide password' : 'Show password'}
                aria-pressed={visible.current}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-ledger hover:text-ink"
                tabIndex={-1}
              >
                {visible.current ? <PiEyeSlashBold size={17} /> : <PiEyeBold size={17} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="change-pw-new" className="text-xs font-medium text-ledger mb-1.5 block">New password</label>
            <div className="relative">
              <input
                id="change-pw-new"
                name="new-password"
                type={visible.next ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => toggleVisible('next')}
                aria-label={visible.next ? 'Hide password' : 'Show password'}
                aria-pressed={visible.next}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-ledger hover:text-ink"
                tabIndex={-1}
              >
                {visible.next ? <PiEyeSlashBold size={17} /> : <PiEyeBold size={17} />}
              </button>
            </div>
            <p className="text-xs text-ledger mt-1.5">At least 6 characters.</p>
          </div>
          <div>
            <label htmlFor="change-pw-confirm" className="text-xs font-medium text-ledger mb-1.5 block">Confirm new password</label>
            <div className="relative">
              <input
                id="change-pw-confirm"
                name="confirm-password"
                type={visible.confirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => toggleVisible('confirm')}
                aria-label={visible.confirm ? 'Hide password' : 'Show password'}
                aria-pressed={visible.confirm}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-ledger hover:text-ink"
                tabIndex={-1}
              >
                {visible.confirm ? <PiEyeSlashBold size={17} /> : <PiEyeBold size={17} />}
              </button>
            </div>
          </div>

          <Button type="submit" full size="lg" disabled={saving}>
            {saving ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
