import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <Link className="nav-logo" to="/">VIN<span>T</span>IQUE</Link>
      <div className="nav-center">
        <input type="text" placeholder="Search for items, brands, sellers..." />
        <button>Search</button>
      </div>
      <div className="nav-right">
        <Link className="nav-link" to="/">Browse</Link>
        <Link className="nav-link" to="/profile">Profile</Link>
        <Link className="btn-sell" to="/sell">+ Sell</Link>
        <Link className="nav-link" to="/auth">Login</Link>
      </div>
    </nav>
  );
}
