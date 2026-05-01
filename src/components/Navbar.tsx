import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { openAuthModal } = useUI();

  const displayName = profile?.username
    ? `@${profile.username}`
    : user?.user_metadata?.username
    ? `@${user.user_metadata.username}`
    : 'Profile';

  return (
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
    </nav>
  );
}
