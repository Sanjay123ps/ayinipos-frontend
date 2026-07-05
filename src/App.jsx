import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Billing from './pages/Billing'
import Products from './pages/Products'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Sessions from './pages/Sessions'
import History from './pages/History'
import CreditBills from './pages/CreditBills'
import More from './pages/More'
import ChangePassword from './pages/ChangePassword'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/products" element={<Products />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/more" element={<More />} />
        <Route path="/history" element={<History />} />
        <Route path="/credit-bills" element={<CreditBills />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
