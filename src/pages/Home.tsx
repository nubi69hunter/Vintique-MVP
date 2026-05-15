import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const catLabel = (key: string) => t(`categories.${key}`, { defaultValue: key });
  const condLabel = (key: string) => t(`conditions.${key}`, { defaultValue: key });
  const [searchParams] = useSearchParams();
  const gender = searchParams.get('gender') || 'all';

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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
    const timer = setTimeout(() => {
      setPriceMin(priceMinInput);
      setPriceMax(priceMaxInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [priceMinInput, priceMaxInput]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
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
      {/* CATEGORY */}
      <div className="sidebar-section">
        <button className="sidebar-section-header" onClick={() => toggleSection('Category')}>
          <span>{t('home.category')}{categories.length > 0 && <span className="sidebar-section-badge">{categories.length}</span>}</span>
          <span className="sidebar-section-chevron">{expandedSections.includes('Category') ? '−' : '+'}</span>
        </button>
        {expandedSections.includes('Category') && (
          <div className="sidebar-section-body">
            {Object.entries(CATEGORY_MAP).map(([parent, subs]) => (
              <div key={parent} className="sidebar-category-group">
                <button
                  className="sidebar-category-parent"
                  onClick={() => toggleExpandedCategory(parent)}
                >
                  {catLabel(parent)}
                  <span className="sidebar-category-chevron">
                    {expandedCategories.includes(parent) ? '−' : '+'}
                  </span>
                </button>
                {expandedCategories.includes(parent) && (
                  <div className="sidebar-subcategories">
                    {subs.map(sub => (
                      <button
                        key={sub}
                        className={`filter-chip${categories.includes(sub) ? ' active' : ''}`}
                        onClick={() => toggle(setCategories, sub)}
                      >
                        {catLabel(sub)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SIZE */}
      <div className="sidebar-section">
        <button className="sidebar-section-header" onClick={() => toggleSection('Size')}>
          <span>{t('home.size')}{sizes.length > 0 && <span className="sidebar-section-badge">{sizes.length}</span>}</span>
          <span className="sidebar-section-chevron">{expandedSections.includes('Size') ? '−' : '+'}</span>
        </button>
        {expandedSections.includes('Size') && (
          <div className="sidebar-section-body">
            {SIZES.map(s => (
              <button
                key={s}
                className={`filter-chip${sizes.includes(s) ? ' active' : ''}`}
                onClick={() => toggle(setSizes, s)}
              >
                {catLabel(s)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONDITION */}
      <div className="sidebar-section">
        <button className="sidebar-section-header" onClick={() => toggleSection('Condition')}>
          <span>{t('home.condition')}{conditions.length > 0 && <span className="sidebar-section-badge">{conditions.length}</span>}</span>
          <span className="sidebar-section-chevron">{expandedSections.includes('Condition') ? '−' : '+'}</span>
        </button>
        {expandedSections.includes('Condition') && (
          <div className="sidebar-section-body">
            {CONDITIONS.map(c => (
              <button
                key={c}
                className={`filter-chip${conditions.includes(c) ? ' active' : ''}`}
                onClick={() => toggle(setConditions, c)}
              >
                {condLabel(c)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PRICE */}
      <div className="sidebar-section">
        <button className="sidebar-section-header" onClick={() => toggleSection('Price')}>
          <span>{t('home.price')}{(priceMin || priceMax) && <span className="sidebar-section-badge">1</span>}</span>
          <span className="sidebar-section-chevron">{expandedSections.includes('Price') ? '−' : '+'}</span>
        </button>
        {expandedSections.includes('Price') && (
          <div className="sidebar-section-body">
            <div className="price-range">
              <input
                className="price-input"
                type="number"
                placeholder={t('home.min')}
                value={priceMinInput}
                onChange={e => setPriceMinInput(e.target.value)}
              />
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>—</span>
              <input
                className="price-input"
                type="number"
                placeholder={t('home.max')}
                value={priceMaxInput}
                onChange={e => setPriceMaxInput(e.target.value)}
              />
            </div>
          </div>
        )}
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
          {sidebarOpen ? t('home.hideFilters') : t('home.filters')}
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
                style={{ marginTop: '1.5rem', background: 'transparent', color: 'var(--rust)', border: '1px solid var(--rust)' }}
                onClick={clearFilters}
              >
                {t('home.clearAll')} ({activeFilterCount})
              </button>
            )}
          </div>
        </aside>

        {/* LISTINGS */}
        <main className="listings-area">
          <div className="listings-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div className="listings-count">
                {loading
                  ? t('home.loading')
                  : t('home.itemsFound', { count: listings.length })}
              </div>
              <button className="mobile-filter-btn" onClick={() => setFilterOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                {t('home.filters')}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>
            </div>
            <select
              className="sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="newest">{t('home.newest')}</option>
              <option value="price_asc">{t('home.priceLow')}</option>
              <option value="price_desc">{t('home.priceHigh')}</option>
            </select>
          </div>
          <div className="listings-grid">
            {!loading && listings.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
                {t('home.noItems')}
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
          <span className="filter-sheet-title">{t('home.filters')}</span>
          <button className="filter-sheet-close" onClick={() => setFilterOpen(false)}>✕</button>
        </div>
        {filterContent}
        {activeFilterCount > 0 && (
          <button
            className="filter-btn"
            style={{ marginBottom: '0.5rem', background: 'transparent', color: 'var(--rust)', border: '1px solid var(--rust)' }}
            onClick={clearFilters}
          >
            {t('home.clearAll')} ({activeFilterCount})
          </button>
        )}
        <button className="filter-btn" onClick={() => setFilterOpen(false)}>{t('home.done')}</button>
      </div>
    </div>
  );
}
