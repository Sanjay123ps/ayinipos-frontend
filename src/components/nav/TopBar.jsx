import { useNavigate, Link } from 'react-router-dom'
import { PiSignOutBold, PiCaretLeftBold } from 'react-icons/pi'
import { useAuth } from '../../context/AuthContext'

export default function TopBar({ title, subtitle, right, backTo }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-porcelain/95 backdrop-blur-sm">
      <div className="max-w-xl mx-auto px-4 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {backTo && (
            <Link
              to={backTo}
              className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-ledger shrink-0"
              aria-label="Back"
            >
              <PiCaretLeftBold size={16} />
            </Link>
          )}
          <div>
            <h1 className="font-display text-xl text-ink leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-ledger mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {right}
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-ledger active:scale-95 transition-transform"
            aria-label="Log out"
          >
            <PiSignOutBold size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
