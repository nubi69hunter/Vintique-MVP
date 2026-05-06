import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { Listing } from '../data';
import { supabase } from '../lib/supabase';

const CATEGORY_MAP: Record<string, string[]> = {
  'Clothing': ['Tops', 'T-shirts', 'Shirts', 'Hoodies & Sweatshirts', 'Jackets & Coats', 'Dresses', 'Abayas', 'Pants & Jeans', 'Shorts', 'Skirts', 'Activewear', 'Loungewear', 'Underwear & Sleepwear'],
  'Shoes': ['Sneakers', 'Boots', 'Heels', 'Sandals', 'Formal'],
  'Bags': ['Handbags', 'Backpacks', 'Crossbody', 'Totes', 'Wallets'],
  'Accessories': ['Belts', 'Sunglasses', 'Watches', 'Jewelry', 'Scarves'],
  'Headwear': ['Caps', 'Hats', 'Beanies', 'Shemaghs'],
  'Fragrances': ['Perfumes', 'Body Sprays', 'Oud'],
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'One size'];
const CONDITIONS = ['New with tags', 'Like new', 'Good', 'Fair'];

export default function Home() {
  const [searchParams] = useSearchParams();
  const gender = searchParams.get('gender') || 'all';

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Clothing']);

  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [priceMinInput, setPriceMinInput] = useState('');
  const [priceMaxInput, setPriceMaxInput] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState('newest');

  // Debounce price inputs
  useEffect(() => {
    const t = setTimeout(() => {
      setPriceMin(priceMinInput);
      setPriceMax(priceMaxInput);
    }, 500);
    return () => clearTimeout(t);
  }, [priceMinInput, priceMaxInput]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const toggleExpandedCategory = (parent: string) => {
    setExpandedCategories(prev =>
      prev.includes(parent) ? prev.filter(p => p !== parent) : [...prev, parent]
    );
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchListings() {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = supabase.from('listings').select('*').eq('status', 'active');

      if (gender === 'men') q = q.or('gender.eq.men,gender.eq.unisex');
      else if (gender === 'women') q = q.or('gender.eq.women,gender.eq.unisex');

      if (categories.length) q = q.in('category', categories);
      if (sizes.length) q = q.in('size', sizes);
      if (conditions.length) q = q.in('condition', conditions);
      if (priceMin) q = q.gte('price', Number(priceMin));
      if (priceMax) q = q.lte('price', Number(priceMax));

      if (sort === 'price_asc') q = q.order('price', { ascending: true });
      else if (sort === 'price_desc') q = q.order('price', { ascending: false });
      else q = q.order('id', { ascending: false });

      const { data, error } = await q;
      if (!cancelled) {
        if (!error && data) setListings(data);
        setLoading(false);
      }
    }
    fetchListings();
    return () => { cancelled = true; };
  }, [gender, categories, sizes, conditions, priceMin, priceMax, sort]);

  const filterContent = (
    <>
      <div className="sidebar-section">
        <div className="sidebar-title">Category</div>
        {Object.entries(CATEGORY_MAP).map(([parent, subs]) => (
          <div key={parent} className="sidebar-category-group">
            <button
              className="sidebar-category-parent"
              onClick={() => toggleExpandedCategory(parent)}
            >
              {parent}
              <span className="sidebar-category-chevron">
                {expandedCategories.includes(parent) ? '−' : '+'}
              </span>
            </button>
            {expandedCategories.includes(parent) && (
              <div className="filter-group sidebar-subcategories">
                {subs.map(sub => (
                  <label key={sub} className="filter-item">
                    <input
                      type="checkbox"
                      checked={categories.includes(sub)}
                      onChange={() => toggle(setCategories, sub)}
                    /> {sub}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title">Size</div>
        <div className="filter-group">
          {SIZES.map(s => (
            <label key={s} className="filter-item">
              <input
                type="checkbox"
                checked={sizes.includes(s)}
                onChange={() => toggle(setSizes, s)}
              /> {s}
            </label>
          ))}
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title">Condition</div>
        <div className="filter-group">
          {CONDITIONS.map(c => (
            <label key={c} className="filter-item">
              <input
                type="checkbox"
                checked={conditions.includes(c)}
                onChange={() => toggle(setConditions, c)}
              /> {c}
            </label>
          ))}
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title">Price (SAR)</div>
        <div className="price-range">
          <input
            className="price-input"
            type="number"
            placeholder="Min"
            value={priceMinInput}
            onChange={e => setPriceMinInput(e.target.value)}
          />
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>—</span>
          <input
            className="price-input"
            type="number"
            placeholder="Max"
            value={priceMaxInput}
            onChange={e => setPriceMaxInput(e.target.value)}
          />
        </div>
      </div>
    </>
  );

  const activeFilterCount = categories.length + sizes.length + conditions.length + (priceMin || priceMax ? 1 : 0);
  const clearFilters = () => {
    setCategories([]); setSizes([]); setConditions([]);
    setPriceMinInput(''); setPriceMaxInput('');
  };

  return (
    <div className="page home-page" style={{ display: 'block' }}>
      {/* Filters toggle toolbar — desktop only */}
      <div className="market-toolbar">
        <button
          className={`filters-toggle-btn${sidebarOpen ? ' active' : ''}`}
          onClick={() => setSidebarOpen(o => !o)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          {sidebarOpen ? 'Hide Filters' : 'Filters'}
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>
      </div>

      <div className="home-layout">
        {/* SIDEBAR — desktop, toggleable */}
        <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ' sidebar-collapsed'}`}>
          <div className="sidebar-inner">
            {filterContent}
            {activeFilterCount > 0 && (
              <button
                className="filter-btn"
                style={{ marginBottom: '0.5rem', background: 'transparent', color: 'var(--rust)', border: '1px solid var(--rust)' }}
                onClick={clearFilters}
              >
                Clear filters ({activeFilterCount})
              </button>
            )}
          </div>
        </aside>

        {/* LISTINGS */}
        <main className="listings-area">
          <div className="listings-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div className="listings-count">
                {loading ? 'Loading...' : `${listings.length} item${listings.length !== 1 ? 's' : ''} found`}
              </div>
              <button className="mobile-filter-btn" onClick={() => setFilterOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>
            </div>
            <select
              className="sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
          <div className="listings-grid">
            {!loading && listings.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
                No items found. Try adjusting your filters.
              </div>
            )}
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
        {activeFilterCount > 0 && (
          <button
            className="filter-btn"
            style={{ marginBottom: '0.5rem', background: 'transparent', color: 'var(--rust)', border: '1px solid var(--rust)' }}
            onClick={clearFilters}
          >
            Clear filters ({activeFilterCount})
          </button>
        )}
        <button className="filter-btn" onClick={() => setFilterOpen(false)}>Done</button>
      </div>
    </div>
  );
}
