import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';
import ListingCard from '../components/ListingCard';

export default function Profile() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Active Listings');
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { openAuthModal } = useUI();
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  const tabs = [
    { key: 'Active Listings', label: t('profile.activeListings') },
    { key: 'Sold', label: t('profile.sold') },
    { key: 'Purchases', label: t('profile.purchases') },
    { key: 'Reviews', label: t('profile.reviews') },
  ];

  // Fetch active count once for the stats display
  useEffect(() => {
    if (!user) return;
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('seller_id', user.id)
      .eq('status', 'active')
      .then(({ count }) => { if (count !== null) setActiveCount(count); });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'Purchases' || activeTab === 'Reviews') {
      setListings([]);
      return;
    }
    const status = activeTab === 'Active Listings' ? 'active' : 'sold';
    setListingsLoading(true);
    supabase
      .from('listings')
      .select('*')
      .eq('seller_id', user.id)
      .eq('status', status)
      .order('id', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setListings(data);
        else setListings([]);
        setListingsLoading(false);
      });
  }, [user, activeTab]);

  if (authLoading) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '4rem' }}>{t('profile.loading')}</div>
  );

  if (!user) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '6rem 2rem' }}>
      <div style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--muted)' }}>
        {t('profile.loginRequired')}
      </div>
      <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2.5rem' }} onClick={openAuthModal}>
        {t('profile.login')}
      </button>
    </div>
  );

  const avatarLetter = profile?.first_name?.charAt(0)?.toUpperCase()
    || user.user_metadata?.full_name?.charAt(0)?.toUpperCase()
    || 'U';

  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email || 'User'
    : user.user_metadata?.full_name || user.email || 'User';

  const username = profile?.username || user.user_metadata?.username || 'username';
  const city = profile?.city || '';

  const renderTabContent = () => {
    if (activeTab === 'Purchases') {
      return (
        <div className="empty">
          <div className="empty-icon">🛍️</div>
          <div className="empty-title">{t('profile.purchasesComingSoon')}</div>
          <div className="empty-text">{t('profile.purchasesText')}</div>
        </div>
      );
    }

    if (activeTab === 'Reviews') {
      return (
        <div className="empty">
          <div className="empty-icon">⭐</div>
          <div className="empty-title">{t('profile.reviewsComingSoon')}</div>
          <div className="empty-text">{t('profile.reviewsText')}</div>
        </div>
      );
    }

    if (listingsLoading) {
      return (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          {t('profile.loading')}
        </div>
      );
    }

    if (listings.length === 0) {
      return (
        <div className="empty">
          <div className="empty-icon">👗</div>
          <div className="empty-title">{activeTab === 'Active Listings' ? t('profile.noListings') : t('profile.noSold')}</div>
          <div className="empty-text">
            {activeTab === 'Active Listings' ? (
              <>
                {t('profile.noListingsText')}{' '}
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit', padding: 0 }}
                  onClick={() => navigate('/sell')}
                >
                  {t('profile.noListingsLink')}
                </button>
              </>
            ) : t('profile.noSoldText')}
          </div>
        </div>
      );
    }

    return (
      <div className="listings-grid">
        {listings.map(listing => (
          <div key={listing.id} className="profile-listing-wrap">
            <ListingCard listing={listing} />
            {activeTab === 'Active Listings' && (
              <div className="profile-listing-controls">
                <button
                  className="profile-listing-edit"
                  onClick={() => navigate(`/edit-listing/${listing.id}`)}
                >
                  {t('profile.edit')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page" style={{ display: 'block' }}>
      <div className="profile-header">
        <div className="profile-top">
          <div className="profile-avatar" style={{ overflow: 'hidden' }}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <span>{avatarLetter}</span>
            )}
          </div>
          <div>
            <div className="profile-name">{displayName}</div>
            <div className="profile-bio">@{username}{city ? ` · ${city}` : ''}</div>
            <div className="profile-stats">
              <div>
                <div className="profile-stat-num">{activeCount}</div>
                <div className="profile-stat-label">{t('profile.listings')}</div>
              </div>
              <div>
                <div className="profile-stat-num">0</div>
                <div className="profile-stat-label">{t('profile.sales')}</div>
              </div>
              <div>
                <div className="profile-stat-num">5.0 ⭐</div>
                <div className="profile-stat-label">{t('profile.rating')}</div>
              </div>
            </div>
          </div>
          <button className="btn-sell" style={{ marginLeft: 'auto', padding: '0.6rem 1.5rem' }} onClick={() => navigate('/sell')}>{t('profile.newListing')}</button>
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button key={tab.key} className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
        {renderTabContent()}
        <div className="profile-signout">
          <button className="profile-signout-btn" onClick={signOut}>{t('profile.signOut')}</button>
        </div>
      </div>
    </div>
  );
}
