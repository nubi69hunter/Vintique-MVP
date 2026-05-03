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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isHome = location.pathname === '/';
  const activeGender = searchParams.get('gender') || 'all';

  const displayName = profile?.username
    ? `@${profile.username}`
    : user?.user_metadata?.username
    ? `@${user.user_metadata.username}`
    : 'Profile';

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

  return (
    <>
      <nav>
        <Link className="nav-logo" to="/">VIN<span>T</span>IQUE</Link>
        <div className="nav-center">
          <input type="text" placeholder="Search for items, brands, sellers..." />
          <button>Search</button>
        </div>

        {/* Desktop right */}
        <div className="nav-right">
          <Link className="nav-link" to="/">Browse</Link>
          {user ? (
            <>
              <Link className="nav-link nav-inbox-btn" to="/inbox">
                <InboxIcon />
                {unreadCount > 0 && (
                  <span className="nav-inbox-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </Link>
              <Link className="nav-link" to="/profile">{displayName}</Link>
              <Link className="btn-sell" to="/sell">+ Sell</Link>
              <button
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, color: 'inherit' }}
                onClick={signOut}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-sell" to="/sell">+ Sell</Link>
              <button
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, color: 'inherit' }}
                onClick={openAuthModal}
              >
                Login
              </button>
            </>
          )}
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
        </div>
      </nav>

      {mobileSearchOpen && (
        <div className="mobile-search-bar">
          <input type="text" placeholder="Search items, brands, sellers..." autoFocus />
          <button onClick={() => setMobileSearchOpen(false)}>✕</button>
        </div>
      )}

      {isHome && (
        <div className="nav-gender-bar">
          <Link to="/" className={`nav-gender-tab${activeGender === 'all' ? ' active' : ''}`}>All</Link>
          <Link to="/?gender=women" className={`nav-gender-tab${activeGender === 'women' ? ' active' : ''}`}>Women</Link>
          <Link to="/?gender=men" className={`nav-gender-tab${activeGender === 'men' ? ' active' : ''}`}>Men</Link>
        </div>
      )}
    </>
  );
}
