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
  const { showToast, openChat, openAuthModal } = useUI();
  const [activeThumb, setActiveThumb] = useState(0);
  const { user } = useAuth();
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    supabase.from('listings').select('*').eq('id', id).single().then(({ data, error }) => {
      if (!error && data) {
        setListing(data);
      }
      setLoading(false);
    });
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (!listing) return;

    try {
      setBuying(true);
      const { error } = await supabase.from('orders').insert([{
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.seller_id,
        status: 'pending'
      }]);

      if (error) {
        showToast(error.message);
      } else {
        showToast('Order placed! Seller will contact you to arrange a meetup.');
      }
    } catch (e: any) {
      showToast(e.message || 'Error occurred while placing order');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="page" style={{display: 'block'}}><div style={{padding: '4rem', textAlign: 'center'}}>Loading...</div></div>;
  if (!listing) return <div className="page" style={{display: 'block'}}><div style={{padding: '4rem', textAlign: 'center'}}>Listing not found</div></div>;

  return (
    <div className="page" style={{display: 'block'}}>
      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="main-img">
            <div className="main-img-placeholder">{listing.emoji || '👗'}</div>
          </div>
          <div className="thumb-row">
            <div className={`thumb ${activeThumb === 0 ? 'active' : ''}`} onClick={() => setActiveThumb(0)}>
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e2d8', fontSize: '1.2rem' }}>{listing.emoji || '👗'}</div>
            </div>
            <div className={`thumb ${activeThumb === 1 ? 'active' : ''}`} onClick={() => setActiveThumb(1)}>
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#d4cec4', fontSize: '1.2rem' }}>{listing.emoji || '👗'}</div>
            </div>
            <div className={`thumb ${activeThumb === 2 ? 'active' : ''}`} onClick={() => setActiveThumb(2)}>
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#c8c2b8', fontSize: '1.2rem' }}>{listing.emoji || '👗'}</div>
            </div>
          </div>
        </div>
        <div className="detail-info">
          <div className="detail-seller">
            <div className="seller-avatar">{listing.seller?.charAt(1)?.toUpperCase() || 'ن'}</div>
            <div>
              <div className="seller-name">{listing.seller || 'Seller'}</div>
              <div className="seller-rating">⭐ 4.9 · 47 sales · Riyadh</div>
            </div>
            <button className="btn-secondary" style={{ width: 'auto', padding: '0.4rem 1rem', marginLeft: 'auto', fontSize: '0.7rem' }} onClick={openChat}>Message</button>
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
              <div className="meta-label">Colour</div>
              <div className="meta-value">Beige</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Posted</div>
              <div className="meta-value">Recently</div>
            </div>
          </div>
          <div className="detail-actions">
            <button className="btn-primary" onClick={handleBuy} disabled={buying}>{buying ? 'Placing Order...' : `Buy Now — ${listing.price} SAR`}</button>
            <button className="btn-secondary" onClick={openChat}>Message Seller</button>
          </div>
        </div>
      </div>
    </div>
  );
}
