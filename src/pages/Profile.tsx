import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';
import ListingCard from '../components/ListingCard';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Active Listings');
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { openAuthModal } = useUI();
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

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

  const tabs = ['Active Listings', 'Sold', 'Purchases', 'Reviews'];

  if (authLoading) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '4rem' }}>Loading...</div>
  );

  if (!user) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '6rem 2rem' }}>
      <div style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--muted)' }}>
        Please log in to view your profile.
      </div>
      <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2.5rem' }} onClick={openAuthModal}>
        Login
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
          <div className="empty-title">Purchases Coming Soon</div>
          <div className="empty-text">Purchases coming soon when payments launch.</div>
        </div>
      );
    }

    if (activeTab === 'Reviews') {
      return (
        <div className="empty">
          <div className="empty-icon">⭐</div>
          <div className="empty-title">Reviews Coming Soon</div>
          <div className="empty-text">Reviews coming soon.</div>
        </div>
      );
    }

    if (listingsLoading) {
      return (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          Loading...
        </div>
      );
    }

    if (listings.length === 0) {
      return (
        <div className="empty">
          <div className="empty-icon">👗</div>
          <div className="empty-title">{activeTab === 'Active Listings' ? 'No Listings Yet' : 'No Sold Items'}</div>
          <div className="empty-text">
            {activeTab === 'Active Listings' ? (
              <>
                List your first item{' '}
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit', padding: 0 }}
                  onClick={() => navigate('/sell')}
                >
                  here →
                </button>
              </>
            ) : 'Items you sell will appear here.'}
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
                  Edit
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
                <div className="profile-stat-label">Listings</div>
              </div>
              <div>
                <div className="profile-stat-num">0</div>
                <div className="profile-stat-label">Sales</div>
              </div>
              <div>
                <div className="profile-stat-num">5.0 ⭐</div>
                <div className="profile-stat-label">Rating</div>
              </div>
            </div>
          </div>
          <button className="btn-sell" style={{ marginLeft: 'auto', padding: '0.6rem 1.5rem' }} onClick={() => navigate('/sell')}>+ New Listing</button>
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button key={tab} className={`profile-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
}
