import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { supabase } from '../lib/supabase';

export default function Onboarding() {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('Riyadh');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.first_name) navigate('/');
  }, [profile, navigate]);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!firstName.trim()) { showToast('Please enter your first name.'); return; }
    try {
      setLoading(true);
      let avatarUrl: string | null = null;

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `avatars/${user.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('listing-photos')
          .upload(path, avatarFile, { upsert: true });
        if (uploadError) {
          showToast('Avatar upload failed: ' + uploadError.message);
          return;
        }
        const { data: urlData } = supabase.storage.from('listing-photos').getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }

      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user';

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username,
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        date_of_birth: dob || null,
        city: city || null,
        avatar_url: avatarUrl,
      });

      if (error) {
        showToast(error.message);
      } else {
        await refreshProfile();
        navigate('/');
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: 'block' }}>
      <div className="onboarding-layout">
        <div className="onboarding-box">
          <div className="onboarding-title">Welcome to Vintique</div>
          <div className="onboarding-subtitle">Tell us a bit about yourself to get started.</div>

          <div className="onboarding-avatar-upload" onClick={() => fileInputRef.current?.click()}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>📷</div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>PHOTO</div>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />

          <div className="sell-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input className="form-input" type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <select className="form-select" value={city} onChange={e => setCity(e.target.value)}>
                <option>Riyadh</option>
                <option>Jeddah</option>
                <option>Dammam</option>
                <option>Mecca</option>
                <option>Medina</option>
                <option>Other</option>
              </select>
            </div>
            <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Saving...' : 'Complete Profile →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
