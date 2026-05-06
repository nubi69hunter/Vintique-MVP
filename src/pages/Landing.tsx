import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';
import ListingCard from '../components/ListingCard';

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

  return (
    <div className="lh-page">

      {/* HERO */}
      <section className="lh-hero">
        <p className="lh-eyebrow">Saudi Arabia's peer-to-peer fashion marketplace.</p>
        <h1 className="lh-headline">Pre-Loved.<br />Now Yours.</h1>
        <div className="lh-ctas">
          <Link to="/market" className="lh-btn-primary">Shop Now</Link>
          <Link to="/sell" className="lh-btn-secondary">Start Selling</Link>
        </div>
      </section>

      {/* JUST DROPPED */}
      <section className="lh-section">
        <div className="lh-section-inner">
          <div className="lh-section-head">
            <h2 className="lh-section-title">Just Dropped</h2>
            <Link to="/market" className="lh-view-all">View all →</Link>
          </div>
          <div className="lh-grid">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lh-how">
        <div className="lh-how-inner">
          <div className="lh-step">
            <div className="lh-step-num">01</div>
            <div className="lh-step-title">List your piece</div>
            <p className="lh-step-desc">Snap a few photos, set your price, go live in minutes.</p>
          </div>
          <div className="lh-step">
            <div className="lh-step-num">02</div>
            <div className="lh-step-title">Connect with buyers</div>
            <p className="lh-step-desc">Chat directly with buyers. Every deal is safe and simple.</p>
          </div>
          <div className="lh-step">
            <div className="lh-step-num">03</div>
            <div className="lh-step-title">Get paid fast</div>
            <p className="lh-step-desc">Money in your account, quickly and securely.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
