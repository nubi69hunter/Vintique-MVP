import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUI } from '../contexts/UIContext';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';
import { useAuth } from '../contexts/AuthContext';
import Price from '../components/Price';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const { openAuthModal } = useUI();
  const [activeThumb, setActiveThumb] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const SOLD_OPTIONS = [
    t('detail.soldOnVintique'),
    t('detail.soldOutside'),
    t('detail.noLongerAvailable'),
    t('detail.cancelled'),
  ];

  const [soldModalOpen, setSoldModalOpen] = useState(false);
  const [soldOption, setSoldOption] = useState<string>('');
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    supabase.from('listings').select('*').eq('id', id).single().then(({ data, error }) => {
      if (!error && data) setListing(data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    setSoldOption(t('detail.soldOnVintique'));
  }, [t]);

  const handleMessageSeller = () => {
    if (!listing) return;
    if (!user) { openAuthModal(); return; }
    navigate(`/inbox/${listing.id}/${listing.seller_id}`);
  };

  const handleMarkSold = async () => {
    if (!listing) return;
    const newStatus = soldOption === t('detail.soldOnVintique') || soldOption === t('detail.soldOutside')
      ? 'sold'
      : 'removed';
    setStatusLoading(true);
    const { error } = await supabase.from('listings').update({ status: newStatus }).eq('id', listing.id);
    setStatusLoading(false);
    if (!error) {
      navigate('/profile');
    }
  };

  if (loading) return <div className="page" style={{ display: 'block' }}><div style={{ padding: '4rem', textAlign: 'center' }}>{t('detail.loading')}</div></div>;
  if (!listing) return <div className="page" style={{ display: 'block' }}><div style={{ padding: '4rem', textAlign: 'center' }}>{t('detail.notFound')}</div></div>;

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
                <div className="seller-name">{listing.seller || t('detail.seller')}</div>
                <div className="seller-rating">⭐ 4.9 · {listing.city || t('detail.saudiArabia')}</div>
              </div>
            </Link>
            {!isOwnListing && (
              <button
                className="btn-secondary"
                style={{ width: 'auto', padding: '0.4rem 1rem', marginLeft: 'auto', fontSize: '0.7rem' }}
                onClick={handleMessageSeller}
              >
                {t('detail.message')}
              </button>
            )}
          </div>
          <div className="detail-title">{listing.title}</div>
          <div className="detail-price">
            <Price value={listing.price} />
          </div>
          <div className="detail-badges">
            <div className="badge condition">{listing.condition}</div>
            <div className="badge">{t('detail.size')} {listing.size}</div>
            <div className="badge">{listing.category}</div>
            <div className="badge">{listing.brand}</div>
          </div>
          <div className="detail-desc">{listing.description}</div>
          <div className="detail-meta">
            <div className="meta-item">
              <div className="meta-label">{t('detail.brand')}</div>
              <div className="meta-value">{listing.brand}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">{t('detail.size')}</div>
              <div className="meta-value">{listing.size}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">{t('detail.shipsFrom')}</div>
              <div className="meta-value">{listing.city || '—'}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">{t('detail.condition')}</div>
              <div className="meta-value">{listing.condition}</div>
            </div>
          </div>
          <div className="detail-actions">
            <button className="btn-coming-soon" disabled>{t('detail.buyNow')}</button>
            <div className="coming-soon-note">{t('detail.comingSoon')}</div>
            {isOwnListing ? (
              <>
                <button className="btn-secondary" onClick={() => navigate(`/inbox?listing=${listing.id}`)}>
                  {t('detail.viewMessages')}
                </button>
                <button
                  className="btn-secondary"
                  style={{ color: 'var(--rust)' }}
                  onClick={() => setSoldModalOpen(true)}
                >
                  {t('detail.markSold')}
                </button>
              </>
            ) : (
              <button className="btn-secondary" onClick={handleMessageSeller}>
                {t('detail.messageSeller')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mark as Sold / Remove modal */}
      <div className={`modal-overlay${soldModalOpen ? ' open' : ''}`} onClick={() => setSoldModalOpen(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-title">{t('detail.whatToDo')}</div>
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
            <button className="btn-secondary" style={{ width: 'auto' }} onClick={() => setSoldModalOpen(false)}>{t('detail.cancel')}</button>
            <button className="btn-primary" style={{ width: 'auto' }} onClick={handleMarkSold} disabled={statusLoading}>
              {statusLoading ? t('detail.updating') : t('detail.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
