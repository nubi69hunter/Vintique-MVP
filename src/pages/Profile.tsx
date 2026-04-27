import { useState, useEffect } from 'react';
import ListingCard from '../components/ListingCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Listing } from '../data';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Active Listings');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [listings, setListings] = useState<Listing[]>([]);
  
  useEffect(() => {
    if (user) {
      supabase.from('listings').select('*').eq('seller_id', user.id).then(({ data, error }) => {
        if (!error && data) {
          setListings(data);
        }
      });
    }
  }, [user]);
  
  const tabs = ['Active Listings', 'Sold', 'Purchases', 'Reviews'];
  
  return (
    <div className="page" style={{display: 'block'}}>
      <div className="profile-header">
        <div className="profile-top">
          <div className="profile-avatar">{user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 'U'}</div>
          <div>
            <div className="profile-name">{user?.user_metadata?.full_name || 'User'}</div>
            <div className="profile-bio">@{user?.user_metadata?.username || 'username'}</div>
            <div className="profile-stats">
              <div>
                <div className="profile-stat-num">{listings.length}</div>
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
        <div className="listings-grid">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
