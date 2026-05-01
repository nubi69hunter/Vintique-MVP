import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../data';

export default function ListingCard({ listing }: { listing: Listing; key?: React.Key }) {
  const photo = listing.photo_urls?.[0];
  return (
    <Link to={`/item/${listing.id}`} className="listing-card">
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
        <div className="card-price">{listing.price} <span>SAR</span></div>
        <div className="card-seller">{listing.seller}</div>
      </div>
    </Link>
  );
}
