import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Save, Loader2, ShieldCheck, GraduationCap, Building2, BadgeCheck } from 'lucide-react';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    full_name: '', phone: '', date_of_birth: '',
    address: '', emergency_contact: '', emergency_phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name:          profile.full_name          || '',
        phone:              profile.phone              || '',
        date_of_birth:      profile.date_of_birth      || '',
        address:            profile.address            || '',
        emergency_contact:  profile.emergency_contact  || '',
        emergency_phone:    profile.emergency_phone    || '',
      });
    }
  }, [profile]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { error } = await supabase.from('profiles').upsert({
        user_id: user.id, ...formData, updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) throw error;
      if (refreshProfile) await refreshProfile();
      setMessage({ text: 'Changes saved successfully.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const initial = (formData.full_name?.charAt(0) || user?.email?.charAt(0) || 'S').toUpperCase();

  return (
    <Layout title="Account Settings">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .field-input { outline: none; transition: border-color 0.2s; font-family: 'DM Sans', sans-serif; }
        .field-input:focus { border-color: #1955e6 !important; }
        .field-input::placeholder { color: #c0bbb5; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Profile banner */}
        <div style={{ background: '#1a1510', padding: '2rem 2.25rem', display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 72, height: 72,
              background: 'linear-gradient(135deg, #1955e6, #6b3de8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 700, color: '#fff',
            }}>{initial}</div>
            <div style={{ position: 'absolute', bottom: -4, right: -4, width: 18, height: 18, background: '#1a7a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #1a1510' }}>
              <BadgeCheck size={10} color="#fff" />
            </div>
          </div>

          <div>
            <h2 className="f-display" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 0.375rem' }}>
              {formData.full_name || 'New Student'}
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', color: '#5a5550', margin: '0 0 0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Mail size={12} /> {user?.email}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#5a5550', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.2rem 0.625rem', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
                ID: {profile?.student_id || '—'}
              </span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#7aabff', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.2rem 0.625rem', border: '1px solid #7aabff30', background: '#7aabff10' }}>
                {profile?.department || 'General'}
              </span>
            </div>
          </div>

          <GraduationCap size={100} color="rgba(255,255,255,0.03)" style={{ position: 'absolute', right: -16, bottom: -20 }} />
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '1px', background: '#ddd8d0', alignItems: 'start' }}>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

            {/* Personal */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ height: 1, width: 24, background: '#1955e6' }} />
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#1955e6', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  Personal Profile
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.25rem' }}>
                {[
                  { label: 'Full Name',    name: 'full_name',     type: 'text',  placeholder: 'John Doe', colSpan: false },
                  { label: 'Date of Birth',name: 'date_of_birth', type: 'date',  placeholder: '',         colSpan: false },
                  { label: 'Address',      name: 'address',       type: 'area',  placeholder: 'Complete Address', colSpan: true  },
                ].map(field => (
                  <div key={field.name} style={field.colSpan ? { gridColumn: '1/-1' } : {}}>
                    <label style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#6b6460', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {field.label}
                    </label>
                    {field.type === 'area' ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        rows={3}
                        placeholder={field.placeholder}
                        className="field-input"
                        style={{ width: '100%', padding: '0.75rem 1rem', background: '#faf8f5', border: '1.5px solid #ddd8d0', color: '#1a1510', fontSize: '0.875rem', resize: 'none' }}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="field-input"
                        style={{ width: '100%', height: 46, padding: '0 1rem', background: '#faf8f5', border: '1.5px solid #ddd8d0', color: '#1a1510', fontSize: '0.875rem' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ height: 1, width: 24, background: '#1a7a4a' }} />
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#1a7a4a', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  Contact &amp; Emergency
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.25rem' }}>
                {[
                  { label: 'Phone Number',       name: 'phone',             type: 'tel',  placeholder: '+63 000 000 0000', colSpan: false },
                  { label: 'Emergency Contact',  name: 'emergency_contact', type: 'text', placeholder: 'Guardian name',    colSpan: false },
                  { label: 'Emergency Phone',    name: 'emergency_phone',   type: 'tel',  placeholder: 'Guardian contact', colSpan: true  },
                ].map(field => (
                  <div key={field.name} style={field.colSpan ? { gridColumn: '1/-1' } : {}}>
                    <label style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#6b6460', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="field-input"
                      style={{ width: '100%', height: 46, padding: '0 1rem', background: '#faf8f5', border: '1.5px solid #ddd8d0', color: '#1a1510', fontSize: '0.875rem' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid #e8e2db' }}>
              {message.text && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', color: message.type === 'success' ? '#1a7a4a' : '#c83030' }}>
                  <ShieldCheck size={14} /> {message.text}
                </div>
              )}
              <button type="submit" disabled={loading} style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem',
                height: 42, padding: '0 1.5rem',
                background: loading ? '#e8e2db' : '#1a1510',
                border: 'none', color: loading ? '#a0a09c' : '#F7F3EE',
                fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
              }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2e2820'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1a1510'; }}>
                {loading ? <Loader2 size={14} style={{ animation: 'spin 0.75s linear infinite' }} /> : <Save size={14} />}
                Save Changes
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <div style={{ background: '#fff', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ width: 28, height: 2, background: '#8a857f', marginBottom: '0.75rem' }} />
              <h3 className="f-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1510', margin: 0 }}>
                System Records
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#ddd8d0' }}>
              {[
                { label: 'Year Level',   val: `Year ${profile?.year_level || 1}`,                                  icon: GraduationCap, color: '#1955e6' },
                { label: 'Department',   val: profile?.department || 'Not Set',                                     icon: Building2,     color: '#8b3de8' },
                { label: 'Registered',   val: profile?.created_at ? new Date(profile.created_at).getFullYear() : '2024', icon: Calendar, color: '#1a7a4a' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ background: '#faf8f5', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 30, height: 30, flexShrink: 0, background: item.color + '12', border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={14} color={item.color} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#a0a09c', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{item.label}</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: '#1a1510', margin: '0.1rem 0 0' }}>{item.val}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: '#f0faf4', border: '1px solid #a8dfc0', padding: '0.875rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <ShieldCheck size={13} color="#1a7a4a" />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700, color: '#1a7a4a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Verified Student</span>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#4a6c56', lineHeight: 1.55, margin: 0 }}>
                Records are synced with the University registrar. Contact support for ID corrections.
              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}