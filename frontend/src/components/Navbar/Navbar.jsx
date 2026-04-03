import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav className="navbar glass" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="10" width="24" height="8" rx="2" fill="url(#grad1)" />
              <rect x="10" y="2" width="8" height="24" rx="2" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#818cf8" />
                  <stop offset="1" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-text">
            <span className="brand-highlight">Apex</span>Care
          </span>
        </Link>

        <div className="navbar-links" id="navbar-links">
          {!isDashboard && (
            <>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
              <a href="#features" className="nav-link">Features</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#contact" className="nav-link">Contact</a>
            </>
          )}
        </div>

        <div className="navbar-actions" id="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-avatar">
                {user.name.charAt(0)}
              </div>
              <span className="user-name">{user.name}</span>
              <span className="user-role-badge">{user.role}</span>
              {!isDashboard && (
                <Link to="/dashboard" className="btn btn-sm btn-glass" id="btn-dashboard">
                  Dashboard
                </Link>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-glow" id="btn-login-nav">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
