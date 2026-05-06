import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { openAuthModal } = useUI();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isMarket = location.pathname === '/market';
  const activeGender = searchParams.get('gender') || 'all';

  const displayName = profile?.username
    ? `@${profile.username}`
    : user?.user_metadata?.username
    ? `@${user.user_metadata.username}`
    : 'Profile';

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Nav scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Unread messages
  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    const fetchUnread = () => {
      supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false)
        .then(({ count }) => setUnreadCount(count ?? 0));
    };
    fetchUnread();
    const channel = supabase
      .channel(`unread-nav-${user.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      }, fetchUnread)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const InboxIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  );

  const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );

  const MoonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );

  const toggleDark = () => setDark(d => !d);

  return (
    <>
      <nav className={scrolled ? 'nav-scrolled' : ''}>
        <Link className="nav-logo" to="/">VIN<span>T</span>IQUE</Link>

        <div className="nav-center">
          <input type="text" placeholder="Search for items, brands, sellers..." />
          <button>Search</button>
        </div>

        {/* Desktop nav */}
        <div className="nav-right">
          <Link className="nav-link" to="/market">Market</Link>
          <Link className="nav-link" to="/sell">Sell</Link>
          {user ? (
            <>
              <Link className="nav-link nav-inbox-btn" to="/inbox">
                <InboxIcon />
                {unreadCount > 0 && (
                  <span className="nav-inbox-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </Link>
              <Link className="nav-link" to="/profile">{displayName}</Link>
              <button
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, color: 'inherit' }}
                onClick={signOut}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, color: 'inherit' }}
              onClick={openAuthModal}
            >
              Login
            </button>
          )}
          <button className="nav-icon-btn nav-dark-btn" onClick={toggleDark} aria-label="Toggle dark mode">
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {/* Mobile icons */}
        <div className="nav-mobile-right">
          <button className="nav-icon-btn" onClick={() => setMobileSearchOpen(o => !o)} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          {user && (
            <Link className="nav-icon-btn nav-inbox-btn" to="/inbox" aria-label="Inbox">
              <InboxIcon />
              {unreadCount > 0 && (
                <span className="nav-inbox-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </Link>
          )}
          <Link className="nav-icon-btn nav-icon-sell" to="/sell" aria-label="Sell">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </Link>
          {user ? (
            <Link className="nav-icon-btn" to="/profile" aria-label="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          ) : (
            <button className="nav-icon-btn" onClick={openAuthModal} aria-label="Login">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          )}
          <button className="nav-icon-btn nav-dark-btn" onClick={toggleDark} aria-label="Toggle dark mode">
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>

      {mobileSearchOpen && (
        <div className="mobile-search-bar">
          <input type="text" placeholder="Search items, brands, sellers..." autoFocus />
          <button onClick={() => setMobileSearchOpen(false)}>✕</button>
        </div>
      )}

      {isMarket && (
        <div className="nav-gender-bar">
          <Link to="/market" className={`nav-gender-tab${activeGender === 'all' ? ' active' : ''}`}>All</Link>
          <Link to="/market?gender=women" className={`nav-gender-tab${activeGender === 'women' ? ' active' : ''}`}>Women</Link>
          <Link to="/market?gender=men" className={`nav-gender-tab${activeGender === 'men' ? ' active' : ''}`}>Men</Link>
        </div>
      )}
    </>
  );
}
