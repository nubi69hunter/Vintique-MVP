import { useState } from 'react';
import { useUI } from '../contexts/UIContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const { t } = useTranslation();
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
        showToast(t('auth.loggedIn'));
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
      const { error } = await supabase.auth.signUp({
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
        showToast(t('auth.accountCreated'));
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
            {t('auth.quote')}
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-box">
            <div className="auth-tabs">
              <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>{t('auth.login')}</button>
              <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>{t('auth.signup')}</button>
            </div>

            {tab === 'login' && (
              <div className="auth-form">
                <div className="form-group">
                  <label className="form-label">{t('auth.email')}</label>
                  <input className="form-input" type="email" placeholder={t('auth.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('auth.password')}</label>
                  <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="btn-primary" onClick={handleLogin} disabled={loading}>{loading ? t('auth.loggingIn') : t('auth.login')}</button>
                <div className="form-divider">{t('auth.or')}</div>
                <button className="btn-secondary" onClick={() => showToast(t('auth.googleLoginSoon'))}>{t('auth.googleLogin')}</button>
              </div>
            )}

            {tab === 'signup' && (
              <div className="auth-form">
                <div className="form-group">
                  <label className="form-label">{t('auth.fullName')}</label>
                  <input className="form-input" type="text" placeholder={t('auth.yourName')} value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('auth.username')}</label>
                  <input className="form-input" type="text" placeholder="@username" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('auth.email')}</label>
                  <input className="form-input" type="email" placeholder={t('auth.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('auth.password')}</label>
                  <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="btn-primary" onClick={handleSignup} disabled={loading}>{loading ? t('auth.creatingAccount') : t('auth.createAccount')}</button>
                <div className="form-divider">{t('auth.or')}</div>
                <button className="btn-secondary" onClick={() => showToast(t('auth.googleSignupSoon'))}>{t('auth.googleLogin')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
