import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../data';
import Price from './Price';

export default function ListingCard({ listing }: { listing: Listing; key?: React.Key }) {
  const photo = listing.photo_urls?.[0];
  return (
    <div className="listing-card">
      {/* Full-card overlay — navigates to listing detail */}
      <Link to={`/item/${listing.id}`} className="listing-card-overlay" aria-label={listing.title} />
      <div className="card-img">
        {photo ? (
          <img src={photo} alt={listing.title} />
        ) : (
          <div className="card-img-placeholder">{listing.emoji || '👗'}</div>
        )}
        <div className="card-badge">{listing.condition}</div>
      </div>
      <div className="card-info">
        <div className="card-title">{listing.title}</div>
        <div className="card-meta">{listing.brand}</div>
        <Price value={listing.price} className="card-price" />
        <Link to={`/seller/${listing.seller_id}`} className="card-seller">
          {listing.seller}
        </Link>
      </div>
    </div>
  );
}
