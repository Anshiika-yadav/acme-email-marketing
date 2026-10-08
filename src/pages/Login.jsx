import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useApp();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAuthenticated(true);
      navigate('/');
    }, 900);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-mark">A</div>
          <div>
            <div className="login-company">Acme Technologies</div>
            <div className="login-tagline">Marketing Workspace</div>
          </div>
        </div>

        <div className="login-divider" />

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your marketing workspace</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }} noValidate>
          {error && (
            <div className="login-error">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                id="email"
                type="email"
                className="form-input"
                style={{ paddingLeft: 34 }}
                placeholder="you@acmetechnologies.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: 34, paddingRight: 36 }}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: -4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={form.remember}
                onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                style={{ accentColor: 'var(--crimson)', cursor: 'pointer' }}
              />
              Remember me
            </label>
            <button type="button" style={{ fontSize: 13, color: 'var(--crimson)', background: 'none', cursor: 'pointer' }}>
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg className="spin" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".2" /><path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="login-demo-note">
          Demo mode — any email &amp; password will sign you in.
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .login-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 36px 40px 32px;
          width: 100%;
          max-width: 420px;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 0;
        }

        .login-logo-mark {
          width: 40px; height: 40px;
          background: var(--crimson);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 800; color: white;
        }

        .login-company {
          font-size: 16px; font-weight: 700;
          color: var(--text-primary);
        }

        .login-tagline {
          font-size: 12px; color: var(--text-muted);
        }

        .login-divider {
          border-top: 1px solid var(--border);
          margin: 20px 0 24px;
        }

        .login-title {
          font-size: 22px; font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .login-subtitle {
          font-size: 14px; color: var(--text-muted);
          margin-top: 5px;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--error-bg);
          color: var(--error);
          border: 1px solid #f5c6c6;
          border-radius: var(--radius-md);
          padding: 9px 12px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .login-demo-note {
          text-align: center;
          font-size: 12px;
          color: var(--text-xsmall);
          margin-top: 20px;
        }

        @media (max-width: 480px) {
          .login-card { padding: 28px 20px 24px; }
        }
      `}</style>
    </div>
  );
}
