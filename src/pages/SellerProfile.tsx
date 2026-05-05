import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';
import ListingCard from '../components/ListingCard';

interface SellerData {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  city: string | null;
}

export default function SellerProfile() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;
    Promise.all([
      supabase.from('profiles').select('id, username, first_name, last_name, avatar_url, city').eq('id', sellerId).single(),
      supabase.from('listings').select('*').eq('seller_id', sellerId).eq('status', 'active').order('id', { ascending: false }),
    ]).then(([{ data: profile }, { data: listingsData }]) => {
      if (profile) setSeller(profile);
      if (listingsData) setListings(listingsData);
      setLoading(false);
    });
  }, [sellerId]);

  if (loading) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '4rem' }}>Loading...</div>
  );
  if (!seller) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '4rem' }}>Seller not found</div>
  );

  const displayName = [seller.first_name, seller.last_name].filter(Boolean).join(' ') || seller.username || 'Seller';
  const avatarLetter = (seller.first_name || seller.username || '?').charAt(0).toUpperCase();

  return (
    <div className="page" style={{ display: 'block' }}>
      <div className="profile-header">
        <div className="profile-top">
          <div className="profile-avatar" style={{ overflow: 'hidden' }}>
            {seller.avatar_url ? (
              <img src={seller.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <span>{avatarLetter}</span>
            )}
          </div>
          <div>
            <div className="profile-name">{displayName}</div>
            <div className="profile-bio">
              @{seller.username || 'user'}{seller.city ? ` · ${seller.city}` : ''}
            </div>
            <div className="profile-stats">
              <div>
                <div className="profile-stat-num">{listings.length}</div>
                <div className="profile-stat-label">Listings</div>
              </div>
              <div>
                <div className="profile-stat-num">5.0 ⭐</div>
                <div className="profile-stat-label">Rating</div>
              </div>
            </div>
          </div>
          <button
            className="btn-secondary"
            style={{ marginLeft: 'auto', width: 'auto', padding: '0.5rem 1.2rem', color: 'rgba(245,240,232,0.8)', borderColor: 'rgba(245,240,232,0.2)', background: 'transparent' }}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>
      <div className="profile-body">
        <div style={{ marginBottom: '1.5rem', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Active Listings · {listings.length}
        </div>
        {listings.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">👗</div>
            <div className="empty-title">No Listings Yet</div>
            <div className="empty-text">This seller hasn't listed anything yet.</div>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
