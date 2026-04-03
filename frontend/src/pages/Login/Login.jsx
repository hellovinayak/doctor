import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg-effects">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
        <div className="login-grid-overlay"></div>
      </div>

      <div className="login-container animate-fade-in">
        <Link to="/" className="login-back" id="btn-back-home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </Link>

        <div className="login-card">
          <div className="login-header">
            <div className="login-brand-icon">
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="10" width="24" height="8" rx="2" fill="url(#loginGrad)" />
                <rect x="10" y="2" width="8" height="24" rx="2" fill="url(#loginGrad)" />
                <defs>
                  <linearGradient id="loginGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#818cf8" />
                    <stop offset="1" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="login-title">Welcome Back</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form" id="login-form">
            {error && (
              <div className="login-error animate-fade-in">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="input-email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="input-password"
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-login ${loading ? 'loading' : ''}`}
              disabled={loading}
              id="btn-login"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Sign In
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px", color: "var(--text-secondary)" }}>
            Don't have an account? <Link to="/signup" style={{ color: "var(--primary-color)", fontWeight: "500", textDecoration: "underline" }}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
