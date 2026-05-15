import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUI } from '../contexts/UIContext';
import { supabase } from '../lib/supabase';

export default function AuthModal() {
  const { t } = useTranslation();
  const { isAuthModalOpen, closeAuthModal, showToast } = useUI();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail(''); setPassword(''); setUsername(''); setSignupDone(false);
  };

  const handleClose = () => { resetForm(); closeAuthModal(); };

  const handleLogin = async () => {
    if (!email || !password) { showToast(t('auth.enterEmailPassword')); return; }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(error.message);
      } else {
        showToast(t('auth.loggedIn'));
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
    if (!email || !password || !username) { showToast(t('auth.fillAllFields')); return; }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin + '/onboarding',
        },
      });
      if (error) {
        showToast(error.message);
      } else {
        setSignupDone(true);
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

        {signupDone ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
            <div className="modal-title" style={{ marginBottom: '0.5rem' }}>{t('authModal.checkEmail')}</div>
            <div className="modal-body">
              {t('authModal.verificationSent', { email })}
            </div>
            <button className="btn-secondary" style={{ width: 'auto', padding: '0.6rem 2rem' }} onClick={handleClose}>
              {t('authModal.gotIt')}
            </button>
          </div>
        ) : (
          <>
            <div className="modal-title" style={{ marginBottom: '1.5rem' }}>{t('authModal.welcome')}</div>
            <div className="auth-tabs" style={{ marginBottom: '1.5rem' }}>
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
                  {loading ? t('auth.loggingIn') : t('auth.login')}
                </button>
                <div className="form-divider">{t('auth.or')}</div>
                <button className="btn-secondary" disabled style={{ opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed', position: 'relative' }}>
                  {t('auth.googleLogin')}
                  {' '}
                  <span className="google-soon-badge">{t('auth.googleComingSoonBadge')}</span>
                </button>
              </div>
            )}

            {tab === 'signup' && (
              <div className="auth-form">
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
                  {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
                </button>
                <div className="form-divider">{t('auth.or')}</div>
                <button className="btn-secondary" disabled style={{ opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed', position: 'relative' }}>
                  {t('auth.googleLogin')}
                  {' '}
                  <span className="google-soon-badge">{t('auth.googleComingSoonBadge')}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
