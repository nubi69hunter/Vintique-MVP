import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';

export default function Landing() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('id', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data) setListings(data);
      });
  }, []);

  const heroListings = listings.slice(0, 6);

  return (
    <div className="landing">

      {/* HERO — split screen */}
      <section className="landing-hero">
        <div className="landing-hero-left">
          <div className="landing-hero-content">
            <p className="landing-eyebrow">Saudi Arabia's first P2P fashion marketplace</p>
            <h1 className="landing-headline">
              Pre-loved.<br />
              <em className="landing-accent">Reworn.</em><br />
              Rewired.
            </h1>
            <p className="landing-subhead">
              Buy and sell pre-loved clothing,<br className="landing-hide-mobile" /> safely and instantly.
            </p>
            <div className="landing-ctas">
              <Link to="/market" className="landing-btn-primary">Shop now</Link>
              <Link to="/sell" className="landing-btn-secondary">Start selling</Link>
            </div>
          </div>
        </div>

        <div className="landing-hero-right">
          <div className="landing-hero-grid">
            {(heroListings.length > 0 ? heroListings : (Array(6).fill(null) as null[])).map((listing, i) =>
              listing ? (
                <Link
                  key={listing.id}
                  to={`/item/${listing.id}`}
                  className={`landing-hero-card lhc-${i}`}
                >
                  <div className="lhc-img">
                    {listing.photo_urls?.[0] ? (
                      <img src={listing.photo_urls[0]} alt={listing.title} loading="lazy" />
                    ) : (
                      <div className="lhc-placeholder">{listing.emoji ?? '👗'}</div>
                    )}
                    <div className="lhc-overlay">
                      <span className="lhc-price">{listing.price} SAR</span>
                      <span className="lhc-cond">{listing.condition}</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div key={i} className={`landing-hero-card lhc-${i} lhc-skeleton`} />
              )
            )}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="landing-featured">
        <div className="landing-featured-inner">
          <div className="landing-section-head">
            <h2 className="landing-section-title">Just dropped</h2>
            <Link to="/market" className="landing-see-all">See all →</Link>
          </div>
          <div className="landing-scroll">
            {listings.map(listing => (
              <Link key={listing.id} to={`/item/${listing.id}`} className="landing-scroll-card">
                <div className="landing-scroll-img">
                  {listing.photo_urls?.[0] ? (
                    <img src={listing.photo_urls[0]} alt={listing.title} loading="lazy" />
                  ) : (
                    <div className="landing-scroll-placeholder">{listing.emoji ?? '👗'}</div>
                  )}
                  <span className="landing-scroll-badge">{listing.condition}</span>
                </div>
                <div className="landing-scroll-info">
                  <div className="landing-scroll-name">{listing.title}</div>
                  <div className="landing-scroll-price">{listing.price} SAR</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-how">
        <div className="landing-how-inner">
          <h2 className="landing-how-title">How it works</h2>
          <div className="landing-steps">

            <div className="landing-step">
              <div className="landing-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="landing-step-num">01</div>
              <div className="landing-step-title">Snap & list</div>
              <p className="landing-step-desc">Take a few photos, set your price, and go live in under 2 minutes.</p>
            </div>

            <div className="landing-step">
              <div className="landing-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="landing-step-num">02</div>
              <div className="landing-step-title">Sell securely</div>
              <p className="landing-step-desc">Chat directly with buyers. Every deal is protected end to end.</p>
            </div>

            <div className="landing-step">
              <div className="landing-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="landing-step-num">03</div>
              <div className="landing-step-title">Get paid fast</div>
              <p className="landing-step-desc">Money lands in your account quickly and safely, every time.</p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-left">
            <div className="landing-footer-logo">VIN<span>T</span>IQUE</div>
            <div className="landing-footer-tag">Pre-loved. Reworn. Rewired.</div>
          </div>
          <div className="landing-footer-links">
            <a href="#" className="landing-footer-link">Instagram</a>
            <a href="#" className="landing-footer-link">Twitter</a>
            <a href="#" className="landing-footer-link">TikTok</a>
          </div>
        </div>
        <div className="landing-footer-copy">© 2025 Vintique. All rights reserved.</div>
      </footer>

    </div>
  );
}
