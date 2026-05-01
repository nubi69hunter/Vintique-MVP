import { useParams } from 'react-router-dom';
import { useUI } from '../contexts/UIContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';
import { useAuth } from '../contexts/AuthContext';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const { openChat, openAuthModal } = useUI();
  const [activeThumb, setActiveThumb] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    supabase.from('listings').select('*').eq('id', id).single().then(({ data, error }) => {
      if (!error && data) setListing(data);
      setLoading(false);
    });
  }, [id]);

  const handleOpenChat = () => {
    if (!listing) return;
    if (!user) { openAuthModal(); return; }
    openChat({
      listingId: listing.id,
      sellerId: listing.seller_id || '',
      sellerName: listing.seller || 'Seller',
    });
  };

  if (loading) return <div className="page" style={{ display: 'block' }}><div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div></div>;
  if (!listing) return <div className="page" style={{ display: 'block' }}><div style={{ padding: '4rem', textAlign: 'center' }}>Listing not found</div></div>;

  const photos = listing.photo_urls || [];
  const activePhoto = photos[activeThumb];

  return (
    <div className="page" style={{ display: 'block' }}>
      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="main-img">
            {activePhoto ? (
              <img src={activePhoto} alt={listing.title} />
            ) : (
              <div className="main-img-placeholder">{listing.emoji || '👗'}</div>
            )}
          </div>
          <div className="thumb-row">
            {photos.length > 0 ? photos.slice(0, 4).map((url, i) => (
              <div key={i} className={`thumb ${activeThumb === i ? 'active' : ''}`} onClick={() => setActiveThumb(i)}>
                <img src={url} alt={`photo ${i + 1}`} />
              </div>
            )) : (
              <>
                <div className={`thumb ${activeThumb === 0 ? 'active' : ''}`} onClick={() => setActiveThumb(0)}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e2d8', fontSize: '1.2rem' }}>{listing.emoji || '👗'}</div>
                </div>
                <div className={`thumb ${activeThumb === 1 ? 'active' : ''}`} onClick={() => setActiveThumb(1)}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#d4cec4', fontSize: '1.2rem' }}>{listing.emoji || '👗'}</div>
                </div>
                <div className={`thumb ${activeThumb === 2 ? 'active' : ''}`} onClick={() => setActiveThumb(2)}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#c8c2b8', fontSize: '1.2rem' }}>{listing.emoji || '👗'}</div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="detail-info">
          <div className="detail-seller">
            <div className="seller-avatar">{listing.seller?.charAt(1)?.toUpperCase() || 'S'}</div>
            <div>
              <div className="seller-name">{listing.seller || 'Seller'}</div>
              <div className="seller-rating">⭐ 4.9 · {listing.city || 'Saudi Arabia'}</div>
            </div>
            <button className="btn-secondary" style={{ width: 'auto', padding: '0.4rem 1rem', marginLeft: 'auto', fontSize: '0.7rem' }} onClick={handleOpenChat}>Message</button>
          </div>
          <div className="detail-title">{listing.title}</div>
          <div className="detail-price">{listing.price} <span>SAR</span></div>
          <div className="detail-badges">
            <div className="badge condition">{listing.condition}</div>
            <div className="badge">Size {listing.size}</div>
            <div className="badge">{listing.category}</div>
            <div className="badge">{listing.brand}</div>
          </div>
          <div className="detail-desc">{listing.description}</div>
          <div className="detail-meta">
            <div className="meta-item">
              <div className="meta-label">Brand</div>
              <div className="meta-value">{listing.brand}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Size</div>
              <div className="meta-value">{listing.size}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Ships from</div>
              <div className="meta-value">{listing.city || '—'}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Condition</div>
              <div className="meta-value">{listing.condition}</div>
            </div>
          </div>
          <div className="detail-actions">
            <button className="btn-coming-soon" disabled>Buy Now — Coming Soon</button>
            <div className="coming-soon-note">Secure payments coming soon. Message the seller to arrange a meetup.</div>
            <button className="btn-secondary" onClick={handleOpenChat}>Message Seller</button>
          </div>
        </div>
      </div>
    </div>
  );
}
