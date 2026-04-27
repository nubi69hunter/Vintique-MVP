import { useState } from 'react';
import { useUI } from '../contexts/UIContext';
import { supabase } from '../lib/supabase';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, showToast } = useUI();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail(''); setPassword(''); setName(''); setUsername('');
  };

  const handleClose = () => { resetForm(); closeAuthModal(); };

  const handleLogin = async () => {
    if (!email || !password) { showToast('Please enter email and password.'); return; }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(error.message);
      } else {
        showToast('Logged in successfully!');
        resetForm();
        closeAuthModal();
      }
    } catch (e: any) {
      showToast(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password) { showToast('Please fill in all fields.'); return; }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, username } },
      });
      if (error) {
        showToast(error.message);
      } else {
        showToast('Account created! Welcome to Vintique.');
        resetForm();
        closeAuthModal();
      }
    } catch (e: any) {
      showToast(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay open" onClick={handleClose}>
      <div
        className="modal"
        style={{ maxWidth: '420px', width: '92%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={handleClose}>✕</button>
        <div className="modal-title" style={{ marginBottom: '1.5rem' }}>Welcome to Vintique</div>
        <div className="auth-tabs" style={{ marginBottom: '1.5rem' }}>
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
          <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
        </div>

        {tab === 'login' && (
          <div className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <button className="btn-primary" onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="form-divider">or</div>
            <button className="btn-secondary" onClick={() => showToast('Google login coming soon!')}>Continue with Google</button>
          </div>
        )}

        {tab === 'signup' && (
          <div className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" type="text" placeholder="@username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
              />
            </div>
            <button className="btn-primary" onClick={handleSignup} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <div className="form-divider">or</div>
            <button className="btn-secondary" onClick={() => showToast('Google signup coming soon!')}>Continue with Google</button>
          </div>
        )}
      </div>
    </div>
  );
}
