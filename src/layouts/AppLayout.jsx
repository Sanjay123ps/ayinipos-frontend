import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/nav/BottomNav'

export default function AppLayout() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-xl mx-auto w-full pb-28">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
