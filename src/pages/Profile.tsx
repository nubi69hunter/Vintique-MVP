import { useState } from 'react';
import { LISTINGS } from '../data';
import ListingCard from '../components/ListingCard';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Active Listings');
  const navigate = useNavigate();
  
  const tabs = ['Active Listings', 'Sold', 'Purchases', 'Reviews'];
  
  return (
    <div className="page" style={{display: 'block'}}>
      <div className="profile-header">
        <div className="profile-top">
          <div className="profile-avatar">م</div>
          <div>
            <div className="profile-name">Musab Alshehri</div>
            <div className="profile-bio">Architecture student · Riyadh 🇸🇦 · Vintage & streetwear collector</div>
            <div className="profile-stats">
              <div>
                <div className="profile-stat-num">12</div>
                <div className="profile-stat-label">Listings</div>
              </div>
              <div>
                <div className="profile-stat-num">34</div>
                <div className="profile-stat-label">Sales</div>
              </div>
              <div>
                <div className="profile-stat-num">4.9 ⭐</div>
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
          {LISTINGS.slice(0, 6).map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
