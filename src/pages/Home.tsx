import { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard';
import { Listing } from '../data';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase.from('listings').select('*').order('id', { ascending: false });
      if (!error && data) {
        setListings(data);
      }
      setLoading(false);
    }
    fetchListings();
  }, []);

  return (
    <div className="page" style={{display: 'block'}}>
      <div className="home-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Category</div>
            <div className="filter-group">
              <label className="filter-item"><input type="checkbox" /> Tops & Shirts</label>
              <label className="filter-item"><input type="checkbox" /> Dresses</label>
              <label className="filter-item"><input type="checkbox" /> Pants & Jeans</label>
              <label className="filter-item"><input type="checkbox" /> Outerwear</label>
              <label className="filter-item"><input type="checkbox" /> Shoes</label>
              <label className="filter-item"><input type="checkbox" /> Bags</label>
              <label className="filter-item"><input type="checkbox" /> Accessories</label>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Size</div>
            <div className="filter-group">
              <label className="filter-item"><input type="checkbox" /> XS</label>
              <label className="filter-item"><input type="checkbox" /> S</label>
              <label className="filter-item"><input type="checkbox" /> M</label>
              <label className="filter-item"><input type="checkbox" /> L</label>
              <label className="filter-item"><input type="checkbox" /> XL</label>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Condition</div>
            <div className="filter-group">
              <label className="filter-item"><input type="checkbox" /> New with tags</label>
              <label className="filter-item"><input type="checkbox" /> Like new</label>
              <label className="filter-item"><input type="checkbox" /> Good</label>
              <label className="filter-item"><input type="checkbox" /> Fair</label>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Price (SAR)</div>
            <div className="price-range">
              <input className="price-input" type="number" placeholder="Min" />
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>—</span>
              <input className="price-input" type="number" placeholder="Max" />
            </div>
          </div>
          <button className="filter-btn">Apply Filters</button>
        </aside>

        {/* LISTINGS */}
        <main className="listings-area">
          <div className="listings-header">
            <div className="listings-count">{loading ? 'Loading...' : `${listings.length} items found`}</div>
            <select className="sort-select">
              <option>Newest first</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
              <option>Most popular</option>
            </select>
          </div>
          <div className="listings-grid">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
