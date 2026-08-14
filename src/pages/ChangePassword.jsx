import { useState } from 'react'
import toast from 'react-hot-toast'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { changePassword } from '../services/api'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

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
            <input
              id="change-pw-current"
              name="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          <div>
            <label htmlFor="change-pw-new" className="text-xs font-medium text-ledger mb-1.5 block">New password</label>
            <input
              id="change-pw-new"
              name="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="input"
            />
            <p className="text-xs text-ledger mt-1.5">At least 6 characters.</p>
          </div>
          <div>
            <label htmlFor="change-pw-confirm" className="text-xs font-medium text-ledger mb-1.5 block">Confirm new password</label>
            <input
              id="change-pw-confirm"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="input"
            />
          </div>

          <Button type="submit" full size="lg" disabled={saving}>
            {saving ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
