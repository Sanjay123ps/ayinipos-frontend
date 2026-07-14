import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'

// Route-level code splitting: each page only downloads when it's actually
// visited, instead of one 693 KB bundle up front. Login/Dashboard are the
// two guaranteed-first-paint screens and are worth keeping eager so there's
// no extra network round trip on the very first thing anyone sees; every
// other route is lazy.
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
const Billing = lazy(() => import('./pages/Billing'))
const Products = lazy(() => import('./pages/Products'))
const Reports = lazy(() => import('./pages/Reports'))
const Settings = lazy(() => import('./pages/Settings'))
const Sessions = lazy(() => import('./pages/Sessions'))
const History = lazy(() => import('./pages/History'))
const CreditBills = lazy(() => import('./pages/CreditBills'))
const More = lazy(() => import('./pages/More'))
const ChangePassword = lazy(() => import('./pages/ChangePassword'))

function RouteFallback() {
  return <p className="text-sm text-ledger text-center py-20">Loading…</p>
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
  )
}
