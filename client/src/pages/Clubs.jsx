import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users, Calendar, MapPin, UserPlus,
  CircleCheck as CheckCircle2, Code, Palette,
  BarChart3, Heart, Zap, X, Clock
} from 'lucide-react';

export default function Clubs() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [memberships, setMemberships] = useState(new Set());
  const [pendingApplications, setPendingApplications] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [applicationForm, setApplicationForm] = useState({ reason: '', interests: '' });

  const staticClubs = [
    { id: 'static-1', name: 'Programming & Coding Club',  description: 'Learn and collaborate on programming projects. From web development to competitive coding.', meeting_schedule: 'Tue & Thu 6 PM', location: 'Lab 1',              member_count: 45, icon: Code,     accentColor: '#1955e6' },
    { id: 'static-2', name: 'Design & Creative Arts',     description: 'Express yourself through digital and traditional art. Share creations and learn from peers.',  meeting_schedule: 'Wed 5 PM',      location: 'Arts Studio',          member_count: 32, icon: Palette,  accentColor: '#c840a0' },
    { id: 'static-3', name: 'Business & Entrepreneurship',description: 'Build business skills, network with innovators, and launch startup ideas with mentors.',         meeting_schedule: 'Mon 7 PM',      location: 'Business Center',      member_count: 38, icon: BarChart3,accentColor: '#1a7a4a' },
    { id: 'static-4', name: 'Community Service',          description: 'Make a difference through volunteer projects and social initiatives.',                           meeting_schedule: 'Sat 9 AM',      location: 'Student Center',       member_count: 56, icon: Heart,    accentColor: '#c83030' },
    { id: 'static-5', name: 'Innovation Lab',             description: 'Explore cutting-edge science, conduct experiments, and collaborate on research projects.',       meeting_schedule: 'Fri 4 PM',      location: 'Science Lab 3',        member_count: 28, icon: Zap,      accentColor: '#b07020' },
    { id: 'static-6', name: 'Cultural Exchange',          description: 'Celebrate diversity through events, food, and cultural exchanges from around the world.',        meeting_schedule: 'Sun 6 PM',      location: 'Hall A',               member_count: 41, icon: Users,    accentColor: '#6b3de8' },
  ];

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [clubsRes, membershipsRes] = await Promise.all([
          supabase.from('clubs').select('*').eq('status', 'active'),
          supabase.from('club_memberships').select('club_id, status').eq('user_id', user.id),
        ]);
        const fetchedClubs = clubsRes.data || [];
        setClubs(fetchedClubs.length ? fetchedClubs : staticClubs);
        const active = new Set(), pending = new Set();
        membershipsRes.data?.forEach(row => {
          if (row.status === 'active')  active.add(row.club_id);
          if (row.status === 'pending') pending.add(row.club_id);
        });
        setMemberships(active);
        setPendingApplications(pending);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleOpenApplication = (club) => {
    setSelectedClub(club);
    setApplicationForm({ reason: '', interests: '' });
    setApplicationModalOpen(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('club_memberships').insert([{
        user_id: user.id, club_id: selectedClub.id, status: 'pending',
        reason: applicationForm.reason, interests: applicationForm.interests,
      }]);
      if (error) throw error;
      setPendingApplications(prev => new Set([...prev, selectedClub.id]));
      setApplicationModalOpen(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Layout title="Student Clubs">
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Layout>
  );

  return (
    <Layout title="Student Clubs">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .club-card { transition: box-shadow 0.2s; }
        .club-card:hover { box-shadow: 0 8px 28px rgba(26,21,16,0.1); }
        .field-input { outline: none; transition: border-color 0.2s; font-family: 'DM Sans', sans-serif; }
        .field-input:focus { border-color: #1955e6 !important; }
        .field-input::placeholder { color: #c0bbb5; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .modal-body { animation: slideUp 0.22s ease both; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Hero banner */}
        <div style={{ background: '#1a1510', padding: '2rem 2.25rem', position: 'relative', overflow: 'hidden' }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 500, color: '#5a5550', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Student Organizations
          </p>
          <h2 className="f-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 0.5rem' }}>
            Discover your <em style={{ color: '#7aabff', fontStyle: 'italic' }}>community.</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#5a5550', maxWidth: 480, margin: 0 }}>
            Join student-led organizations to develop skills and build your network.
          </p>
          <Users size={110} color="rgba(255,255,255,0.03)" style={{ position: 'absolute', right: -16, bottom: -20 }} />
        </div>

        {/* Club grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: '#ddd8d0' }}>
          {clubs.map(club => {
            const isMember  = memberships.has(club.id);
            const isPending = pendingApplications.has(club.id);
            const ClubIcon  = club.icon || Users;
            const accent    = club.accentColor || '#1955e6';

            return (
              <div key={club.id} className="club-card" style={{ background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Accent top bar */}
                <div style={{ height: 4, background: accent }} />

                {/* Icon strip */}
                <div style={{ padding: '1.25rem 1.375rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.875rem', borderBottom: '1px solid #e8e2db' }}>
                  <div style={{ width: 40, height: 40, flexShrink: 0, background: accent + '14', border: `1px solid ${accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ClubIcon size={18} color={accent} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 600, color: '#1a1510', margin: 0, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {club.name}
                    </h3>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#a0a09c', margin: '0.15rem 0 0' }}>
                      {club.member_count} members
                    </p>
                  </div>
                </div>

                <div style={{ padding: '1rem 1.375rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', color: '#6b6460', lineHeight: 1.6, marginBottom: '0.875rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {club.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {[
                      { icon: Calendar, text: club.meeting_schedule },
                      { icon: MapPin,   text: club.location          },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#F7F3EE', border: '1px solid #e8e2db', padding: '0.25rem 0.5rem' }}>
                        <Icon size={10} color="#c0bbb5" />
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 500, color: '#6b6460' }}>{text}</span>
                      </div>
                    ))}
                  </div>

                  {isMember ? (
                    <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#f0faf4', border: '1px solid #a8dfc0', color: '#1a7a4a' }}>
                      <CheckCircle2 size={13} />
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600 }}>Joined</span>
                    </div>
                  ) : isPending ? (
                    <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#fffbeb', border: '1px solid #f5d87a', color: '#b07020' }}>
                      <Clock size={13} />
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600 }}>Application Pending</span>
                    </div>
                  ) : (
                    <button onClick={() => handleOpenApplication(club)} style={{
                      width: '100%', height: 36,
                      background: 'transparent', border: `1.5px solid ${accent}`,
                      color: accent, fontFamily: "'DM Sans',sans-serif",
                      fontSize: '0.75rem', fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = accent; }}>
                      <UserPlus size={12} /> Join Club
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application modal */}
      {applicationModalOpen && selectedClub && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(26,21,16,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-body" style={{ background: '#F7F3EE', border: '1px solid #ddd8d0', width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: '0 24px 64px rgba(26,21,16,0.2)', fontFamily: "'DM Sans',sans-serif" }}>
            <div style={{ height: 4, background: selectedClub.accentColor || '#1955e6' }} />
            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h4 className="f-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1510', margin: '0 0 0.25rem' }}>Apply to Join</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#8a857f', margin: 0 }}>{selectedClub.name}</p>
                </div>
                <button onClick={() => setApplicationModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0a09c', display: 'flex', marginTop: 2 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#1a1510'}
                  onMouseLeave={e => e.currentTarget.style.color = '#a0a09c'}>
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#6b6460', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Statement of Interest
                  </label>
                  <textarea
                    className="field-input"
                    rows={4}
                    value={applicationForm.reason}
                    onChange={e => setApplicationForm({ ...applicationForm, reason: e.target.value })}
                    placeholder="Why do you want to join?"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#fff', border: '1.5px solid #ddd8d0', color: '#1a1510', fontSize: '0.875rem', resize: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#6b6460', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Relevant Skills
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    value={applicationForm.interests}
                    onChange={e => setApplicationForm({ ...applicationForm, interests: e.target.value })}
                    placeholder="e.g. Design, Coding, etc."
                    style={{ width: '100%', height: 46, padding: '0 1rem', background: '#fff', border: '1.5px solid #ddd8d0', color: '#1a1510', fontSize: '0.875rem' }}
                  />
                </div>
                <button type="submit" disabled={submitting} style={{
                  width: '100%', height: 44,
                  background: submitting ? '#ddd8d0' : '#1a1510',
                  border: 'none', color: submitting ? '#a0a09c' : '#F7F3EE',
                  fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#2e2820'; }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#1a1510'; }}>
                  {submitting ? 'Processing…' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}