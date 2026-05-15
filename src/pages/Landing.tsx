import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';
import ListingCard from '../components/ListingCard';

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
  const { t } = useTranslation();
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

    const timer = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="lh-page">

      {/* ── HERO ── */}
      <section className="lh-hero">
        <div className={`lh-hero-card${loaded ? ' lh-in' : ''}`}>
          <p className="lh-eyebrow">{t('landing.eyebrow')}</p>
          <h1 className="lh-headline">
            {t('landing.headline1')}<br />
            {t('landing.headline2').split(' ').slice(0, -1).join(' ')}{' '}
            <em className="lh-accent">{t('landing.headline2').split(' ').pop()}</em>
          </h1>
          <p className="lh-subhead">{t('landing.subhead')}</p>
          <div className="lh-ctas">
            <Link
              to="/market"
              className="lh-btn-primary"
              onMouseMove={handleMagnetMove}
              onMouseLeave={handleMagnetLeave}
            >{t('landing.shopNow')}</Link>
            <Link
              to="/sell"
              className="lh-btn-secondary"
              onMouseMove={handleMagnetMove}
              onMouseLeave={handleMagnetLeave}
            >{t('landing.startSelling')}</Link>
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
            <h2 className="lh-section-title">{t('landing.justDropped')}</h2>
            <Link to="/market" className="lh-view-all">{t('landing.viewAll')}</Link>
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
            <div className="lh-step-title">{t('landing.step1Title')}</div>
            <p className="lh-step-desc">{t('landing.step1Desc')}</p>
          </div>

          <div className="lh-step">
            <div className="lh-step-num">02</div>
            <div className="lh-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="lh-step-title">{t('landing.step2Title')}</div>
            <p className="lh-step-desc">{t('landing.step2Desc')}</p>
          </div>

          <div className="lh-step">
            <div className="lh-step-num">03</div>
            <div className="lh-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="lh-step-title">{t('landing.step3Title')}</div>
            <p className="lh-step-desc">{t('landing.step3Desc')}</p>
          </div>

        </div>
      </section>

    </div>
  );
}
