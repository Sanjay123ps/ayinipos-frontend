import { Link, useNavigate } from 'react-router-dom'
import {
  PiClockCounterClockwiseDuotone,
  PiCreditCardDuotone,
  PiGearDuotone,
  PiLockKeyDuotone,
  PiCaretRightBold,
  PiSignOutBold,
  PiCashRegisterDuotone,
} from 'react-icons/pi'
import TopBar from '../components/nav/TopBar'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'

const links = [
  {
    to: '/history',
    label: 'History',
    sub: 'Search, filter, view & export bills',
    icon: PiClockCounterClockwiseDuotone,
  },
  {
    to: '/credit-bills',
    label: 'Credit Bills',
    sub: 'Pending & paid credit sales',
    icon: PiCreditCardDuotone,
  },
  {
    to: '/sessions',
    label: 'Sessions',
    sub: 'Open & close the till, count cash',
    icon: PiCashRegisterDuotone,
  },
  {
    to: '/settings',
    label: 'Settings',
    sub: 'Store details, GST & sessions',
    icon: PiGearDuotone,
  },
  {
    to: '/change-password',
    label: 'Change Password',
    sub: 'Update your login password',
    icon: PiLockKeyDuotone,
  },
]

export default function More() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="px-4">
      <TopBar title="More" subtitle="History, credit & settings" />

      <div className="space-y-3.5">
        {links.map(({ to, label, sub, icon: Icon }) => (
          <Link key={to} to={to}>
            <Card className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                <Icon size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-xs text-ledger mt-0.5">{sub}</p>
              </div>
              <PiCaretRightBold className="text-ledger shrink-0" />
            </Card>
          </Link>
        ))}

        <button onClick={handleLogout} className="w-full text-left">
          <Card className="flex items-center gap-4">
            <span className="w-11 h-11 rounded-xl bg-chili-50 flex items-center justify-center text-chili-600 shrink-0">
              <PiSignOutBold size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">Log out</p>
              <p className="text-xs text-ledger mt-0.5">
                {user?.username ? `Signed in as ${user.username}` : 'End your current session'}
              </p>
            </div>
          </Card>
        </button>
      </div>
    </div>
  )
}
