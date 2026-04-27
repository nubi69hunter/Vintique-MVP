import { useState } from 'react';
import { useUI } from '../contexts/UIContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const { showToast } = useUI();
  const navigate = useNavigate();

  const handleAuth = (msg: string) => {
    showToast(msg);
    navigate('/');
  };

  return (
    <div className="page" style={{display: 'block'}}>
      <div className="auth-layout">
        <div className="auth-left">
          <div className="auth-quote">
            Your next favourite <em>outfit</em> is already in someone's wardrobe.
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-box">
            <div className="auth-tabs">
              <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
              <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
            </div>
            
            {tab === 'login' && (
              <div className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="you@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="••••••••" />
                </div>
                <button className="btn-primary" onClick={() => handleAuth('Logged in successfully!')}>Login</button>
                <div className="form-divider">or</div>
                <button className="btn-secondary" onClick={() => showToast('Google login coming soon!')}>Continue with Google</button>
              </div>
            )}

            {tab === 'signup' && (
              <div className="auth-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input className="form-input" type="text" placeholder="@username" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="you@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="••••••••" />
                </div>
                <button className="btn-primary" onClick={() => handleAuth('Account created! Welcome to Vintique.')}>Create Account</button>
                <div className="form-divider">or</div>
                <button className="btn-secondary" onClick={() => showToast('Google signup coming soon!')}>Continue with Google</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
