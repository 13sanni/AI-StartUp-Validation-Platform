import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { User, LogOut } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🔭</div>
          <span className="navbar-logo-text">Launch<span>Lens</span></span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-purple hidden md:inline-flex" style={{ fontSize: '0.7rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)', display: 'inline-block', animation: 'agentPulse 2s infinite' }} />
            Powered by Gemini AI
          </span>
          {location.pathname !== '/' && (
            <Link to="/" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              ← New Analysis
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4 ml-2">
              <Link to="/dashboard" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors" title="Dashboard">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30 text-brand-primary">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.name || 'Dashboard'}</span>
              </Link>
              <button onClick={handleLogout} className="text-white/50 hover:text-brand-secondary transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-white/10 pl-4 ml-2">
              <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
