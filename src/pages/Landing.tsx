import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';
import ListingCard from '../components/ListingCard';

// Stable rotations — no Math.random() to avoid re-render jitter
const ROTS = [-1.8, 1.4, -0.9, 2.1, -1.5, 0.8];

function useReveal(threshold = 0.14) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function handleMagnetMove(e: React.MouseEvent<HTMLAnchorElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
  const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
  el.style.transform = `translate(${x}px, ${y - 2}px)`;
}

function handleMagnetLeave(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.transform = '';
}

export default function Landing() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loaded, setLoaded] = useState(false);
  const drop = useReveal();
  const how = useReveal();

  useEffect(() => {
    supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('id', { ascending: false })
      .limit(8)
      .then(({ data }) => { if (data) setListings(data); });

    // Slight delay so CSS transitions fire after mount
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const heroCards: (Listing | null)[] =
    listings.length > 0 ? listings.slice(0, 6) : Array(6).fill(null);

  return (
    <div className="lh-page">

      {/* ── HERO ── */}
      <section className="lh-hero">

        {/* Left — copy */}
        <div className={`lh-hero-left${loaded ? ' lh-in' : ''}`}>
          <p className="lh-eyebrow">Saudi Arabia's resale marketplace</p>
          <h1 className="lh-headline">
            Pre-Loved.<br />
            Now <em className="lh-accent">Yours.</em>
          </h1>
          <p className="lh-subhead">
            Buy and sell pre-loved fashion,<br />safely and instantly.
          </p>
          <div className="lh-ctas">
            <Link
              to="/market"
              className="lh-btn-primary"
              onMouseMove={handleMagnetMove}
              onMouseLeave={handleMagnetLeave}
            >Shop Now</Link>
            <Link
              to="/sell"
              className="lh-btn-secondary"
              onMouseMove={handleMagnetMove}
              onMouseLeave={handleMagnetLeave}
            >Start Selling</Link>
          </div>
        </div>

        {/* Right — live listing grid */}
        <div className="lh-hero-right">
          <div className="lh-hgrid">
            {heroCards.map((listing, i) => (
              <div
                key={listing ? listing.id : i}
                className={`lh-hcard${loaded ? ' lh-hcard-in' : ''}`}
                style={{
                  '--rot': `${ROTS[i]}deg`,
                  '--delay': `${200 + i * 90}ms`,
                } as React.CSSProperties}
              >
                {listing ? (
                  <Link to={`/item/${listing.id}`} className="lh-hcard-link">
                    <div className="lh-hcard-img">
                      {listing.photo_urls?.[0]
                        ? <img src={listing.photo_urls[0]} alt={listing.title} loading="lazy" />
                        : <div className="lh-hcard-emoji">{listing.emoji ?? '👗'}</div>
                      }
                      <div className="lh-hcard-foot">
                        <span className="lh-hcard-price">{listing.price} SAR</span>
                        <span className="lh-hcard-cond">{listing.condition}</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="lh-hcard-skeleton" />
                )}
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── JUST DROPPED ── */}
      <section
        ref={drop.ref}
        className={`lh-section${drop.visible ? ' lh-in' : ''}`}
      >
        <div className="lh-section-inner">
          <div className="lh-section-head">
            <h2 className="lh-section-title">Just Dropped</h2>
            <Link to="/market" className="lh-view-all">View All →</Link>
          </div>
          <div className="lh-grid">
            {listings.map((listing, i) => (
              <div
                key={listing.id}
                className="lh-grid-card"
                style={{ transitionDelay: `${i * 55}ms` }}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        ref={how.ref}
        className={`lh-how${how.visible ? ' lh-in' : ''}`}
      >
        <div className="lh-how-inner">

          <div className="lh-step">
            <div className="lh-step-num">01</div>
            <div className="lh-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div className="lh-step-title">List your piece</div>
            <p className="lh-step-desc">Snap a few photos, set your price, go live in minutes.</p>
          </div>

          <div className="lh-step">
            <div className="lh-step-num">02</div>
            <div className="lh-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="lh-step-title">Connect with buyers</div>
            <p className="lh-step-desc">Chat directly. Every deal is safe and transparent.</p>
          </div>

          <div className="lh-step">
            <div className="lh-step-num">03</div>
            <div className="lh-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="lh-step-title">Get paid fast</div>
            <p className="lh-step-desc">Money in your account, quickly and securely.</p>
          </div>

        </div>
      </section>

    </div>
  );
}
