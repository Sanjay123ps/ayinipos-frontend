import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/nav/BottomNav'

export default function AppLayout() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex flex-col">
      {/* Bottom clearance for the fixed BottomNav below. `--bottom-nav-height`
          is measured live (see BottomNav.jsx) so this always matches the
          nav's actual height — including its own safe-area inset — instead
          of a fixed guess that can under-clear content behind the system
          navigation bar on some devices. The 7rem fallback only applies for
          the brief window before that measurement runs. */}
      <div className="flex-1 max-w-xl mx-auto w-full" style={{ paddingBottom: 'var(--bottom-nav-height, 7rem)' }}>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
