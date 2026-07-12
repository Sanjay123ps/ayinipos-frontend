import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username, password)
      toast.success('Welcome back')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Could not sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center text-3xl shadow-lift mb-4">
          🌿
        </div>
        <h1 className="font-display text-3xl text-ink">Ayini POS</h1>
        <p className="text-sm text-ledger mt-1">Sign in to open today's register</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-card shadow-soft p-6 pb-8 perforated-bottom space-y-4"
      >
        <div>
          <label className="text-xs font-medium text-ledger mb-1.5 block">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            className="w-full rounded-xl border border-mist bg-porcelain px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ledger mb-1.5 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-mist bg-porcelain px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
        {error && <p className="text-xs text-chili-600">{error}</p>}
        <Button type="submit" full disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
