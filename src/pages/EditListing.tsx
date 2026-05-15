import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUI } from '../contexts/UIContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function EditListing() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useUI();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tops & Shirts');
  const [size, setSize] = useState('M');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('Good');
  const [gender, setGender] = useState('women');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('Riyadh');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from('listings').select('*').eq('id', id).single().then(({ data, error }) => {
      if (!error && data) {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCategory(data.category || 'Tops & Shirts');
        setSize(data.size || 'M');
        setBrand(data.brand || '');
        setCondition(data.condition || 'Good');
        setPrice(String(data.price || ''));
        setCity(data.city || 'Riyadh');
        setExistingPhotos(data.photo_urls || []);
        setGender(data.gender || 'women');
      }
      setFetching(false);
    });
  }, [id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (existingPhotos.length + newPhotos.length + files.length > 8) {
      showToast(t('edit.maxPhotos'));
      return;
    }
    const previews = (files as File[]).map(f => URL.createObjectURL(f));
    setNewPhotos(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...previews]);
    e.target.value = '';
  };

  const removeExistingPhoto = (i: number) => {
    setExistingPhotos(prev => prev.filter((_, idx) => idx !== i));
  };

  const removeNewPhoto = (i: number) => {
    setNewPhotos(prev => prev.filter((_, idx) => idx !== i));
    setNewPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const uploadNewPhotos = async (): Promise<string[]> => {
    if (!user) return [];
    const urls: string[] = [];
    for (const file of newPhotos) {
      const ext = file.name.split('.').pop();
      const path = `listings/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('listing-photos').upload(path, file);
      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from('listing-photos').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSave = async () => {
    if (!user || !id) return;
    if (!title || !price) {
      showToast(t('edit.fillRequired'));
      return;
    }
    try {
      setLoading(true);
      const uploadedUrls = await uploadNewPhotos();
      const allPhotoUrls = [...existingPhotos, ...uploadedUrls];
      const { error } = await supabase.from('listings').update({
        title,
        description,
        price: Number(price),
        category,
        size,
        brand,
        condition,
        gender,
        city,
        photo_urls: allPhotoUrls.length > 0 ? allPhotoUrls : null,
      }).eq('id', id);
      if (error) {
        showToast(error.message);
      } else {
        showToast(t('edit.updated'));
        navigate('/profile');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="page" style={{ display: 'block', textAlign: 'center', padding: '4rem' }}>{t('common.loading')}</div>
  );

  const totalPhotos = existingPhotos.length + newPhotos.length;

  return (
    <div className="page" style={{ display: 'block' }}>
      <div className="sell-layout">
        <div className="sell-header">
          <div className="sell-title">{t('edit.title')}</div>
          <div className="sell-subtitle">{t('edit.subtitle')}</div>
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
            {totalPhotos < 8 && (
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-icon">📸</div>
                <div className="upload-text">{t('edit.tapAdd')}</div>
                <div className="upload-subtext">{t('sell.photoHint')}</div>
              </div>
            )}
            {(existingPhotos.length > 0 || newPreviews.length > 0) && (
              <div className="uploaded-photos">
                {existingPhotos.map((url, i) => (
                  <div key={`ex-${i}`} className="photo-thumb">
                    <img src={url} alt={`photo ${i + 1}`} />
                    <button className="photo-remove" onClick={() => removeExistingPhoto(i)}>✕</button>
                  </div>
                ))}
                {newPreviews.map((src, i) => (
                  <div key={`new-${i}`} className="photo-thumb">
                    <img src={src} alt={`new photo ${i + 1}`} />
                    <button className="photo-remove" onClick={() => removeNewPhoto(i)}>✕</button>
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
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('sell.brand')}</label>
                  <input className="form-input" type="text" placeholder={t('sell.brandPlaceholder')} value={brand} onChange={e => setBrand(e.target.value)} />
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
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={handleSave} disabled={loading}>
                {loading ? t('edit.saving') : t('edit.save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
