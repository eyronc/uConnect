import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, User, MapPin, Clock, Plus, X, Video } from 'lucide-react';
import { toast } from 'sonner';

export default function Advising() {
  const { user } = useAuth();
  const [advisors, setAdvisors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [formData, setFormData] = useState({ advisor_id: '', scheduled_at: '', meeting_type: 'virtual' });

  const staticAdvisors = [
    { id: 'static-1', full_name: 'Dr. Maria Santos',    department: 'IT & Computer Science',  email: 'm.santos@edu.ph',    office_location: 'Bldg A-101',    office_hours: 'M/W 2–4pm'     },
    { id: 'static-2', full_name: 'Prof. Juan Dela Cruz', department: 'Mathematics',             email: 'j.delacruz@edu.ph',  office_location: 'Bldg B-203',    office_hours: 'T/TH 10–12pm'  },
    { id: 'static-3', full_name: 'Engr. Elena Wright',  department: 'Civil Engineering',       email: 'e.wright@edu.ph',    office_location: 'Eng Lab 2',     office_hours: 'Friday 1–5pm'  },
    { id: 'static-4', full_name: 'Dr. Ricardo Gomez',   department: 'Business Administration', email: 'r.gomez@edu.ph',     office_location: 'Biz Wing B-12', office_hours: 'T/TH 9–11am'   },
  ];

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [advRes, sessRes, msgRes] = await Promise.all([
        supabase.from('advisors').select('*'),
        supabase.from('advising_sessions').select('*, advisors(*)').eq('student_id', user.id).order('scheduled_at', { ascending: true }),
        supabase.from('messages').select('*').eq('recipient_id', user.id).order('created_at', { ascending: false }).limit(3),
      ]);
      setAdvisors(advRes.data?.length ? advRes.data : staticAdvisors);
      setSessions(sessRes.data || []);
      setMessages(msgRes.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (formData.advisor_id.startsWith('static')) {
      alert('Error: You are using demo data. Please run the SQL INSERT script in Supabase to create real advisors first.');
      return;
    }
    const { error } = await supabase.from('advising_sessions').insert([{
      student_id: user.id,
      advisor_id: formData.advisor_id,
      scheduled_at: formData.scheduled_at,
      meeting_type: formData.meeting_type,
      status: 'scheduled',
    }]);
    if (error) {
      alert('Booking failed: ' + error.message);
    } else {
      setBookingModalOpen(false);
      fetchData();
      setFormData({ advisor_id: '', scheduled_at: '', meeting_type: 'virtual' });
      toast.success('Session scheduled!');
    }
  };

  return (
    <Layout title="Advising">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .advisor-card { transition: box-shadow 0.2s, border-color 0.2s; }
        .advisor-card:hover { box-shadow: 0 6px 24px rgba(26,21,16,0.08); border-color: #1955e6 !important; }
        .session-row:hover { background: #f0ebe4 !important; }
        .field-input { outline: none; transition: border-color 0.2s; font-family: 'DM Sans', sans-serif; }
        .field-input:focus { border-color: #1955e6 !important; }
        .field-input::placeholder { color: #c0bbb5; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .modal-body { animation: slideUp 0.25s ease both; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ width: 36, height: 2, background: '#1955e6', marginBottom: '0.875rem' }} />
            <h2 className="f-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.02em', margin: 0 }}>
              Success Center
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#8a857f', marginTop: '0.375rem' }}>
              Academic guidance and session management.
            </p>
          </div>
          <button onClick={() => setBookingModalOpen(true)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#1a1510', border: 'none', color: '#F7F3EE',
            fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            padding: '0.625rem 1.25rem', cursor: 'pointer',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1955e6'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a1510'}>
            <Plus size={13} /> Book Session
          </button>
        </div>

        {/* Advisors */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <div style={{ width: 3, height: 14, background: '#1955e6' }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#a0a09c', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              Department Faculty
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite' }} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: '#ddd8d0' }}>
              {advisors.map(advisor => (
                <div key={advisor.id} className="advisor-card" style={{ background: '#fff', border: '1px solid transparent', padding: '1.25rem 1.375rem' }}>
                  <div style={{ width: 36, height: 36, background: '#F7F3EE', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                    <User size={16} color="#1955e6" />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 600, color: '#1a1510', margin: '0 0 0.2rem', lineHeight: 1.3 }}>
                    {advisor.full_name}
                  </h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600, color: '#1955e6', marginBottom: '0.875rem' }}>
                    {advisor.department}
                  </p>
                  <div style={{ borderTop: '1px solid #e8e2db', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {[
                      { icon: MapPin, text: advisor.office_location },
                      { icon: Clock,  text: advisor.office_hours     },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Icon size={11} color="#c0bbb5" />
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#8a857f' }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming sessions */}
        {sessions.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <div style={{ width: 3, height: 14, background: '#1a7a4a' }} />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#a0a09c', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                Upcoming Sessions
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#ddd8d0' }}>
              {sessions.map(session => {
                const d = new Date(session.scheduled_at);
                return (
                  <div key={session.id} className="session-row" style={{ background: '#fff', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'background 0.15s' }}>
                    <div style={{ width: 40, flexShrink: 0, textAlign: 'center', background: '#F7F3EE', border: '1px solid #e8e2db', padding: '0.25rem 0' }}>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.6rem', fontWeight: 600, color: '#a0a09c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {d.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', lineHeight: 1.1 }}>
                        {d.getDate()}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1a1510', margin: 0 }}>
                        {session.advisors?.full_name}
                      </p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#8a857f', margin: '0.125rem 0 0' }}>
                        {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                      background: session.meeting_type === 'virtual' ? '#eef3ff' : '#f0faf4',
                      border: `1px solid ${session.meeting_type === 'virtual' ? '#c5d3ff' : '#a8dfc0'}`,
                      color: session.meeting_type === 'virtual' ? '#1955e6' : '#1a7a4a',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}>
                      {session.meeting_type === 'virtual' ? <Video size={10} /> : <MapPin size={10} />}
                      {session.meeting_type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(26,21,16,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          fontFamily: "'DM Sans',sans-serif",
        }}>
          <div className="modal-body" style={{
            background: '#F7F3EE', border: '1px solid #ddd8d0',
            width: '100%', maxWidth: 440, padding: '2rem',
            boxShadow: '0 24px 64px rgba(26,21,16,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <h2 className="f-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1510', margin: 0, letterSpacing: '-0.01em' }}>
                Schedule Session
              </h2>
              <button onClick={() => setBookingModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0a09c', display: 'flex' }}
                onMouseEnter={e => e.currentTarget.style.color = '#1a1510'}
                onMouseLeave={e => e.currentTarget.style.color = '#a0a09c'}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleBookSession} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#6b6460', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Select Advisor
                </label>
                <select
                  className="field-input"
                  value={formData.advisor_id}
                  onChange={e => setFormData({ ...formData, advisor_id: e.target.value })}
                  required
                  style={{ width: '100%', height: 46, padding: '0 1rem', background: '#fff', border: '1.5px solid #ddd8d0', color: '#1a1510', fontSize: '0.875rem', appearance: 'none' }}
                >
                  <option value="" style={{ color: '#c0bbb5' }}>Choose a mentor…</option>
                  {advisors.map(a => (
                    <option key={a.id} value={a.id}>{a.full_name} — {a.department}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#6b6460', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  className="field-input"
                  onChange={e => setFormData({ ...formData, scheduled_at: e.target.value })}
                  required
                  style={{ width: '100%', height: 46, padding: '0 1rem', background: '#fff', border: '1.5px solid #ddd8d0', color: '#1a1510', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#6b6460', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                  {['virtual', 'in-person'].map(type => (
                    <button key={type} type="button" onClick={() => setFormData({ ...formData, meeting_type: type })} style={{
                      height: 40,
                      background: formData.meeting_type === type ? '#1a1510' : '#fff',
                      border: `1.5px solid ${formData.meeting_type === type ? '#1a1510' : '#ddd8d0'}`,
                      color: formData.meeting_type === type ? '#F7F3EE' : '#6b6460',
                      fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 600,
                      letterSpacing: '0.05em', textTransform: 'capitalize', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" style={{
                width: '100%', height: 46, marginTop: '0.5rem',
                background: '#1955e6', border: 'none', color: '#fff',
                fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#1244c4'}
                onMouseLeave={e => e.currentTarget.style.background = '#1955e6'}>
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}