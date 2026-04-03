import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Login/Login.css';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff', specialization: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(form.name, form.email, form.password, form.role, form.specialization, form.phone);
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
                <rect x="2" y="10" width="24" height="8" rx="2" fill="url(#signupGrad)" />
                <rect x="10" y="2" width="8" height="24" rx="2" fill="url(#signupGrad)" />
                <defs>
                  <linearGradient id="signupGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#818cf8" />
                    <stop offset="1" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="login-title">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form" id="signup-form">
            {error && (
              <div className="login-error animate-fade-in">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" placeholder="Enter your full name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" placeholder="Create a password (min 6 chars)" value={form.password} onChange={handleChange} required minLength={6} />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" name="phone" className="form-input" placeholder="+1 555-0000" value={form.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-input" value={form.role} onChange={handleChange}>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {form.role === 'doctor' && (
              <div className="form-group animate-fade-in">
                <label className="form-label">Specialization</label>
                <input type="text" name="specialization" className="form-input" placeholder="e.g. Cardiology, Neurology" value={form.specialization} onChange={handleChange} required />
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary btn-login ${loading ? 'loading' : ''}`}
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? <div className="spinner"></div> : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '500', textDecoration: 'underline' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
