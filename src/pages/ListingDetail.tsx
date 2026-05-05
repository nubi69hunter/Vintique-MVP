import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUI } from '../contexts/UIContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';
import { useAuth } from '../contexts/AuthContext';
import Price from '../components/Price';

const SOLD_OPTIONS = [
  'Sold on Vintique',
  'Sold outside Vintique',
  'No longer available',
  'Cancelled — no buyers',
] as const;

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const { openAuthModal } = useUI();
  const [activeThumb, setActiveThumb] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [soldModalOpen, setSoldModalOpen] = useState(false);
  const [soldOption, setSoldOption] = useState<string>('Sold on Vintique');
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    supabase.from('listings').select('*').eq('id', id).single().then(({ data, error }) => {
      if (!error && data) setListing(data);
      setLoading(false);
    });
  }, [id]);

  const handleMessageSeller = () => {
    if (!listing) return;
    if (!user) { openAuthModal(); return; }
    navigate(`/inbox/${listing.id}/${listing.seller_id}`);
  };

  const handleMarkSold = async () => {
    if (!listing) return;
    const newStatus = soldOption === 'Sold on Vintique' || soldOption === 'Sold outside Vintique'
      ? 'sold'
      : 'removed';
    setStatusLoading(true);
    const { error } = await supabase.from('listings').update({ status: newStatus }).eq('id', listing.id);
    setStatusLoading(false);
    if (!error) {
      navigate('/profile');
    }
  };

  if (loading) return <div className="page" style={{ display: 'block' }}><div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div></div>;
  if (!listing) return <div className="page" style={{ display: 'block' }}><div style={{ padding: '4rem', textAlign: 'center' }}>Listing not found</div></div>;

  const photos = listing.photo_urls || [];
  const activePhoto = photos[activeThumb];
  const isOwnListing = user && listing.seller_id === user.id;

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
            <Link
              to={listing.seller_id ? `/seller/${listing.seller_id}` : '#'}
              className="detail-seller-link"
            >
              <div className="seller-avatar">{listing.seller?.charAt(1)?.toUpperCase() || 'S'}</div>
              <div>
                <div className="seller-name">{listing.seller || 'Seller'}</div>
                <div className="seller-rating">⭐ 4.9 · {listing.city || 'Saudi Arabia'}</div>
              </div>
            </Link>
            {!isOwnListing && (
              <button
                className="btn-secondary"
                style={{ width: 'auto', padding: '0.4rem 1rem', marginLeft: 'auto', fontSize: '0.7rem' }}
                onClick={handleMessageSeller}
              >
                Message
              </button>
            )}
          </div>
          <div className="detail-title">{listing.title}</div>
          <div className="detail-price">
            <Price value={listing.price} />
          </div>
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
            {isOwnListing ? (
              <>
                <button className="btn-secondary" onClick={() => navigate(`/inbox?listing=${listing.id}`)}>
                  View Messages
                </button>
                <button
                  className="btn-secondary"
                  style={{ color: 'var(--rust)' }}
                  onClick={() => setSoldModalOpen(true)}
                >
                  Mark as Sold / Remove
                </button>
              </>
            ) : (
              <button className="btn-secondary" onClick={handleMessageSeller}>
                Message Seller
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mark as Sold / Remove modal */}
      <div className={`modal-overlay${soldModalOpen ? ' open' : ''}`} onClick={() => setSoldModalOpen(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-title">What would you like to do?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.25rem 0 1.75rem' }}>
            {SOLD_OPTIONS.map(opt => (
              <label key={opt} className="modal-radio-row">
                <input
                  type="radio"
                  name="sold-option"
                  value={opt}
                  checked={soldOption === opt}
                  onChange={() => setSoldOption(opt)}
                  style={{ accentColor: 'var(--rust)' }}
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" style={{ width: 'auto' }} onClick={() => setSoldModalOpen(false)}>Cancel</button>
            <button className="btn-primary" style={{ width: 'auto' }} onClick={handleMarkSold} disabled={statusLoading}>
              {statusLoading ? 'Updating...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
