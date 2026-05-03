import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { openAuthModal } = useUI();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const displayName = profile?.username
    ? `@${profile.username}`
    : user?.user_metadata?.username
    ? `@${user.user_metadata.username}`
    : 'Profile';

  return (
    <>
      <nav>
        <Link className="nav-logo" to="/">VIN<span>T</span>IQUE</Link>
        <div className="nav-center">
          <input type="text" placeholder="Search for items, brands, sellers..." />
          <button>Search</button>
        </div>
        <div className="nav-right">
          <Link className="nav-link" to="/">Browse</Link>
          {user ? (
            <>
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

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className="mobile-search-bar">
          <input type="text" placeholder="Search items, brands, sellers..." autoFocus />
          <button onClick={() => setMobileSearchOpen(false)}>✕</button>
        </div>
      )}
    </>
  );
}
