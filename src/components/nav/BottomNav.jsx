import { NavLink, useLocation } from 'react-router-dom'
import {
  PiHouseDuotone,
  PiReceiptDuotone,
  PiPackageDuotone,
  PiChartLineUpDuotone,
  PiDotsThreeCircleDuotone,
} from 'react-icons/pi'
import clsx from 'clsx'

const navItems = [
  { to: '/', label: 'Dashboard', icon: PiHouseDuotone },
  { to: '/billing', label: 'Billing', icon: PiReceiptDuotone },
  { to: '/products', label: 'Products', icon: PiPackageDuotone },
  { to: '/reports', label: 'Reports', icon: PiChartLineUpDuotone },
  { to: '/more', label: 'More', icon: PiDotsThreeCircleDuotone },
]

// Routes reachable only via the More hub, but which should still light up
// the "More" tab in the bottom nav when the person is on one of them.
const moreRoutes = ['/more', '/history', '/credit-bills', '/settings', '/sessions', '/change-password']

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="max-w-xl mx-auto px-3 pb-3">
        <div className="flex items-center justify-between bg-white rounded-[22px] shadow-lift px-2 py-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isMoreTab = to === '/more'
            const isActive = isMoreTab
              ? moreRoutes.some((r) => location.pathname.startsWith(r))
              : location.pathname === to

            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={clsx(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition-colors',
                  isActive ? 'text-emerald-700' : 'text-ledger/70'
                )}
              >
                <span
                  className={clsx(
                    'flex items-center justify-center w-9 h-9 rounded-full transition-colors',
                    isActive && 'bg-emerald-50'
                  )}
                >
                  <Icon size={20} />
                </span>
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
