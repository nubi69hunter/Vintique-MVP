import React, { useState, useRef } from 'react';
import { useUI } from '../contexts/UIContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CATEGORY_MAP: Record<string, string[]> = {
  'Clothing': ['Tops', 'T-shirts', 'Shirts', 'Hoodies & Sweatshirts', 'Jackets & Coats', 'Dresses', 'Abayas', 'Pants & Jeans', 'Shorts', 'Skirts', 'Activewear', 'Loungewear', 'Underwear & Sleepwear'],
  'Shoes': ['Sneakers', 'Boots', 'Heels', 'Sandals', 'Formal'],
  'Bags': ['Handbags', 'Backpacks', 'Crossbody', 'Totes', 'Wallets'],
  'Accessories': ['Belts', 'Sunglasses', 'Watches', 'Jewelry', 'Scarves'],
  'Headwear': ['Caps', 'Hats', 'Beanies', 'Shemaghs'],
  'Fragrances': ['Perfumes', 'Body Sprays', 'Oud'],
};

export default function Sell() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const { showToast, openAuthModal } = useUI();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [parentCategory, setParentCategory] = useState('Clothing');
  const [category, setCategory] = useState('Tops');
  const [size, setSize] = useState('M');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('Good');
  const [gender, setGender] = useState('women');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('Riyadh');
  const [loading, setLoading] = useState(false);

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 8) {
      showToast(t('sell.maxPhotos'));
      return;
    }
    const newPreviews = (files as File[]).map(f => URL.createObjectURL(f));
    setPhotos(prev => [...prev, ...files]);
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const removePhoto = (i: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
    setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of photos) {
      const ext = file.name.split('.').pop();
      const path = `listings/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('listing-photos').upload(path, file);
      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from('listing-photos').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleList = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (!title || !price || !gender) {
      showToast(t('sell.fillRequired'));
      return;
    }

    try {
      setLoading(true);
      const sellerName = user.user_metadata?.username
        ? `@${String(user.user_metadata.username).replace(/^@/, '')}`
        : user.email?.split('@')[0] || 'seller';

      const photoUrls = photos.length > 0 ? await uploadPhotos(user.id) : [];

      const { error } = await supabase.from('listings').insert([
        {
          title,
          description,
          price: Number(price),
          category,
          size,
          brand,
          condition,
          gender,
          city,
          seller_id: user.id,
          seller: sellerName,
          photo_urls: photoUrls.length > 0 ? photoUrls : null,
        }
      ]);

      if (error) {
        showToast(error.message);
      } else {
        showToast(t('sell.listed'));
        navigate('/');
      }
    } catch (err: any) {
      showToast(err.message || 'Error listing item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: 'block' }}>
      <div className="sell-layout">
        <div className="sell-header">
          <div className="sell-title">{t('sell.title')}</div>
          <div className="sell-subtitle">{t('sell.subtitle')}</div>
        </div>
        <div className="sell-steps">
          <div className={`sell-step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`} onClick={() => setStep(1)}>{t('sell.photos')}</div>
          <div className={`sell-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`} onClick={() => setStep(2)}>{t('sell.details')}</div>
          <div className={`sell-step ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>{t('sell.pricing')}</div>
        </div>

        {/* STEP 1: PHOTOS */}
        {step === 1 && (
          <div className="sell-section active">
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotoChange} />
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">📸</div>
              <div className="upload-text">{t('sell.tapUpload')}</div>
              <div className="upload-subtext">{t('sell.photoHint')}</div>
            </div>
            {photoPreviews.length > 0 && (
              <div className="uploaded-photos">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="photo-thumb">
                    <img src={src} alt={`preview ${i + 1}`} />
                    <button className="photo-remove" onClick={() => removePhoto(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="sell-nav" style={{ justifyContent: 'flex-end' }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(2)}>{t('sell.nextDetails')}</button>
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <div className="sell-section active">
            <div className="sell-form">
              <div className="form-group">
                <label className="form-label">{t('sell.titleLabel')}</label>
                <input className="form-input" type="text" placeholder={t('sell.titlePlaceholder')} value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('sell.description')}</label>
                <textarea className="form-textarea" placeholder={t('sell.descPlaceholder')} value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">{t('sell.gender')}</label>
                <div className="gender-toggle">
                  {(['women', 'men', 'unisex'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`gender-toggle-btn${gender === g ? ' active' : ''}`}
                      onClick={() => setGender(g)}
                    >
                      {t(`sell.${g}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('sell.category')}</label>
                  <select
                    className="form-select"
                    value={parentCategory}
                    onChange={e => {
                      const p = e.target.value;
                      setParentCategory(p);
                      setCategory(CATEGORY_MAP[p][0]);
                    }}
                  >
                    {Object.keys(CATEGORY_MAP).map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('sell.subCategory')}</label>
                  <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                    {CATEGORY_MAP[parentCategory].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('sell.size')}</label>
                  <select className="form-select" value={size} onChange={e => setSize(e.target.value)}>
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                    <option>One size</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('sell.condition')}</label>
                  <select className="form-select" value={condition} onChange={e => setCondition(e.target.value)}>
                    <option>New with tags</option>
                    <option>Like new</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('sell.brand')}</label>
                <input className="form-input" type="text" placeholder={t('sell.brandPlaceholder')} value={brand} onChange={e => setBrand(e.target.value)} />
              </div>
            </div>
            <div className="sell-nav">
              <button className="btn-secondary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(1)}>{t('sell.back')}</button>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(3)}>{t('sell.nextPricing')}</button>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING */}
        {step === 3 && (
          <div className="sell-section active">
            <div className="sell-form">
              <div className="form-group">
                <label className="form-label">{t('sell.priceLabel')}</label>
                <input className="form-input" type="number" placeholder="0" style={{ fontSize: '1.5rem', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }} value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div style={{ padding: '1.2rem', background: '#fff', border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: '1.8' }}>
                <div style={{ fontWeight: 500, color: 'var(--black)', marginBottom: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('sell.feeBreakdown')}</div>
                {t('sell.feeText')}
              </div>
              <div className="form-group">
                <label className="form-label">{t('sell.shippingFrom')}</label>
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
              <button className="btn-secondary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(2)}>{t('sell.back')}</button>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={handleList} disabled={loading}>{loading ? t('sell.listing') : t('sell.listItem')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
