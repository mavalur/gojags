import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Wallet } from 'lucide-react';
import type { UserRole } from '../types';
import './AuthPage.css';

export default function AuthPage() {
  const { login, signUp, error, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('editor');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in all required fields.');
      return;
    }
    if (isSignUp && !name) {
      setLocalError('Please enter your name.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    try {
      if (isSignUp) {
        await signUp(name, email, password, role);
      } else {
        await login(email, password);
      }
    } catch {
      // error is set by context
    }
  };

  const displayedError = localError || error;

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Wallet size={24} />
          </div>
          <span className="auth-logo-text">TeamFinance</span>
        </div>

        <h1 className="auth-title">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="auth-subtitle">
          {isSignUp
            ? 'Join your team and start tracking finances'
            : 'Sign in to manage your team finances'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {displayedError && (
            <div className="auth-error">{displayedError}</div>
          )}

          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                id="auth-name"
                className="form-input"
                type="text"
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="auth-email"
              className="form-input"
              type="email"
              placeholder="you@team.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="auth-password"
              className="form-input"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Your Role</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-option ${role === 'editor' ? 'active' : ''}`}
                  onClick={() => setRole('editor')}
                >
                  <div className="role-option-title">✏️ Editor</div>
                  <div className="role-option-desc">Add & manage transactions</div>
                </button>
                <button
                  type="button"
                  className={`role-option ${role === 'viewer' ? 'active' : ''}`}
                  onClick={() => setRole('viewer')}
                >
                  <div className="role-option-title">👁️ Viewer</div>
                  <div className="role-option-desc">View-only access</div>
                </button>
              </div>
            </div>
          )}

          <button
            id="auth-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span
            className="auth-switch-link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setLocalError(null);
            }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </span>
        </div>
      </div>
    </div>
  );
}
