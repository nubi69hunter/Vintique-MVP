import { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard';
import { Listing } from '../data';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase.from('listings').select('*').or('status.eq.active,status.is.null').order('id', { ascending: false });
      if (!error && data) {
        setListings(data);
      }
      setLoading(false);
    }
    fetchListings();
  }, []);

  const filterContent = (
    <>
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
    </>
  );

  return (
    <div className="page" style={{ display: 'block' }}>
      <div className="home-layout">
        {/* SIDEBAR — desktop only */}
        <aside className="sidebar">
          {filterContent}
          <button className="filter-btn">Apply Filters</button>
        </aside>

        {/* LISTINGS */}
        <main className="listings-area">
          <div className="listings-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div className="listings-count">{loading ? 'Loading...' : `${listings.length} items found`}</div>
              <button className="mobile-filter-btn" onClick={() => setFilterOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filters
              </button>
            </div>
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

      {/* Mobile filter sheet */}
      <div className={`filter-sheet-overlay${filterOpen ? ' open' : ''}`} onClick={() => setFilterOpen(false)} />
      <div className={`filter-sheet${filterOpen ? ' open' : ''}`}>
        <div className="filter-sheet-handle" />
        <div className="filter-sheet-header">
          <span className="filter-sheet-title">Filters</span>
          <button className="filter-sheet-close" onClick={() => setFilterOpen(false)}>✕</button>
        </div>
        {filterContent}
        <button className="filter-btn" onClick={() => setFilterOpen(false)}>Apply Filters</button>
      </div>
    </div>
  );
}
