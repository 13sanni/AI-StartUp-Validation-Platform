import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🔭</div>
          <span className="navbar-logo-text">Launch<span>Lens</span></span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)', display: 'inline-block', animation: 'agentPulse 2s infinite' }} />
            Powered by Gemini AI
          </span>
          {location.pathname !== '/' && (
            <Link to="/" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              ← New Analysis
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
