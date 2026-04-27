import { useState } from 'react';
import { useUI } from '../contexts/UIContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Sell() {
  const [step, setStep] = useState(1);
  const { showToast, openAuthModal } = useUI();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tops & Shirts');
  const [size, setSize] = useState('M');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('Good');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('Riyadh');
  const [loading, setLoading] = useState(false);

  const handleList = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (!title || !price) {
      showToast('Please fill in title and price.');
      return;
    }

    try {
      setLoading(true);
      const sellerName = user.user_metadata?.username
        ? `@${String(user.user_metadata.username).replace(/^@/, '')}`
        : user.email?.split('@')[0] || 'seller';

      const { error } = await supabase.from('listings').insert([
        {
          title,
          description,
          price: Number(price),
          category,
          size,
          brand,
          condition,
          city,
          seller_id: user.id,
          seller: sellerName,
        }
      ]);

      if (error) {
        showToast(error.message);
      } else {
        showToast('Item listed successfully! 🎉');
        navigate('/');
      }
    } catch (err: any) {
      showToast(err.message || 'Error listing item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{display: 'block'}}>
      <div className="sell-layout">
        <div className="sell-header">
          <div className="sell-title">List an Item</div>
          <div className="sell-subtitle">Turn your wardrobe into wallet. Takes 2 minutes.</div>
        </div>
        <div className="sell-steps">
          <div className={`sell-step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`} onClick={() => setStep(1)}>Photos</div>
          <div className={`sell-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`} onClick={() => setStep(2)}>Details</div>
          <div className={`sell-step ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>Pricing</div>
        </div>

        {/* STEP 1: PHOTOS */}
        {step === 1 && (
          <div className="sell-section active">
            <div className="upload-zone" onClick={() => showToast('Photo upload coming with Supabase integration!')}>
              <div className="upload-icon">📸</div>
              <div className="upload-text">Tap to upload photos</div>
              <div className="upload-subtext">JPG, PNG up to 10MB · Up to 8 photos</div>
            </div>
            <div className="uploaded-photos">
              <div className="photo-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', background: '#e8e2d8' }}>👗</div>
              <div className="photo-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', background: '#d4cec4' }}>👗</div>
            </div>
            <div className="sell-nav" style={{justifyContent: 'flex-end'}}>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(2)}>Next — Details →</button>
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <div className="sell-section active">
            <div className="sell-form">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" type="text" placeholder="e.g. Zara Linen Blazer, Beige" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Describe the item — condition, fit, any flaws, measurements..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option>Tops & Shirts</option>
                    <option>Dresses</option>
                    <option>Pants & Jeans</option>
                    <option>Outerwear</option>
                    <option>Shoes</option>
                    <option>Bags</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Size</label>
                  <select className="form-select" value={size} onChange={e => setSize(e.target.value)}>
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                    <option>One size</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" type="text" placeholder="e.g. Zara, H&M, Nike" value={brand} onChange={e => setBrand(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select className="form-select" value={condition} onChange={e => setCondition(e.target.value)}>
                    <option>New with tags</option>
                    <option>Like new</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="sell-nav">
              <button className="btn-secondary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(3)}>Next — Pricing →</button>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING */}
        {step === 3 && (
          <div className="sell-section active">
            <div className="sell-form">
              <div className="form-group">
                <label className="form-label">Price (SAR)</label>
                <input className="form-input" type="number" placeholder="0" style={{ fontSize: '1.5rem', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }} value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div style={{ padding: '1.2rem', background: '#fff', border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: '1.8' }}>
                <div style={{ fontWeight: 500, color: 'var(--black)', marginBottom: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fee breakdown</div>
                Listing is free. Vintique takes a 10% commission only when your item sells. Buyer pays shipping via Aramex.
              </div>
              <div className="form-group">
                <label className="form-label">Shipping from</label>
                <select className="form-select" value={city} onChange={e => setCity(e.target.value)}>
                  <option>Riyadh</option>
                  <option>Jeddah</option>
                  <option>Dammam</option>
                  <option>Mecca</option>
                  <option>Medina</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="sell-nav">
              <button className="btn-secondary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={handleList} disabled={loading}>{loading ? 'Listing...' : 'List Item 🚀'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
