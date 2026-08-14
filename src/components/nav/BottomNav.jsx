import { useLayoutEffect, useRef } from 'react'
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
  const navRef = useRef(null)

  // Other fixed bottom UI (the page's own bottom padding, the floating
  // cart bar) needs to sit above this nav without overlapping it or
  // leaving a gap — but the nav's real rendered height varies by device:
  // the bottom safe-area inset alone ranges from 0 (desktop, most phones
  // in a normal browser tab) to ~24-48px (Android 3-button nav or gesture
  // strip) to ~34px (iOS home indicator), and can change at runtime if the
  // person switches gesture/3-button navigation without restarting the
  // app. Measuring the actual element and sharing it as a CSS variable
  // keeps every consumer correct on every device automatically, instead of
  // several hardcoded pixel guesses that can silently drift out of sync
  // with each other and with reality.
  useLayoutEffect(() => {
    const el = navRef.current
    if (!el) return
    const setHeight = () => {
      document.documentElement.style.setProperty('--bottom-nav-height', `${el.offsetHeight}px`)
    }
    setHeight()
    const observer = new ResizeObserver(setHeight)
    observer.observe(el)
    window.addEventListener('orientationchange', setHeight)
    return () => {
      observer.disconnect()
      window.removeEventListener('orientationchange', setHeight)
    }
  }, [])

  return (
    <nav ref={navRef} className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
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
