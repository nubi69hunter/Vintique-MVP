import { useState } from 'react';
import { useUI } from '../contexts/UIContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useUI();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(error.message);
      } else {
        showToast('Logged in successfully!');
        navigate('/');
      }
    } catch (error: any) {
      showToast(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
            username: username
          }
        }
      });
      
      if (error) {
        showToast(error.message);
      } else {
        showToast('Account created! Welcome to Vintique.');
        navigate('/');
      }
    } catch (error: any) {
      showToast(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
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
                  <input className="form-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="btn-primary" onClick={handleLogin} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
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
                  <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="btn-primary" onClick={handleSignup} disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
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
