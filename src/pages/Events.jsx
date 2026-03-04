import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar, MapPin, Users, Clock,
  CircleCheck as CheckCircle2, Trophy, Music,
  BookOpen, Zap, Briefcase, Palette, X
} from 'lucide-react';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState(new Set());
  const [reminders, setReminders] = useState(new Set());
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const staticEvents = [
    { id: 'static-1', title: 'Intramurals – Basketball Tournament', description: 'Join the exciting basketball tournament featuring teams from all departments. Register your team and compete for the championship!', start_date: new Date(Date.now() + 7*86400000).toISOString(),  location: 'Sports Complex, Court 1',     max_attendees: 150, current_attendees: 45,  icon: Trophy,   accentColor: '#e85d20' },
    { id: 'static-2', title: 'UC Days Festival',                    description: 'Annual campus celebration featuring food booths, live performances, games, and activities.',                                           start_date: new Date(Date.now() + 14*86400000).toISOString(), location: 'Main Quad',                   max_attendees: 500, current_attendees: 120, icon: Music,    accentColor: '#8b3de8' },
    { id: 'static-3', title: 'Exam Week Support Sessions',          description: 'Free tutoring and review sessions for all courses. Meet with instructors and peer tutors.',                                           start_date: new Date(Date.now() + 21*86400000).toISOString(), location: 'Library, Multiple Rooms',     max_attendees: 300, current_attendees: 87,  icon: BookOpen, accentColor: '#1955e6' },
    { id: 'static-4', title: 'Tech Symposium 2026',                 description: 'Industry leaders discuss the latest in technology, AI, and digital transformation.',                                                   start_date: new Date(Date.now() + 10*86400000).toISOString(), location: 'Convention Center, Hall A',   max_attendees: 200, current_attendees: 73,  icon: Zap,      accentColor: '#c87d10' },
    { id: 'static-5', title: 'Career Fair 2026',                    description: 'Connect with top companies. Browse booths, submit resumes, and interview with HR representatives.',                                   start_date: new Date(Date.now() +  5*86400000).toISOString(), location: 'Student Center Ballroom',     max_attendees: 400, current_attendees: 156, icon: Briefcase,accentColor: '#1a7a4a' },
    { id: 'static-6', title: 'Art & Culture Showcase',              description: 'Student artwork, performances, and cultural exhibitions celebrating creativity and diversity.',                                       start_date: new Date(Date.now() + 28*86400000).toISOString(), location: 'Arts Building Gallery',       max_attendees: 250, current_attendees: 62,  icon: Palette,  accentColor: '#6b3de8' },
  ];

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [eventsRes, registrationsRes] = await Promise.all([
          supabase.from('events').select('*').gte('start_date', new Date().toISOString()).order('start_date', { ascending: true }),
          supabase.from('event_registrations').select('event_id').eq('user_id', user.id).eq('status', 'registered'),
        ]);
        const fetched = eventsRes.data || [];
        setEvents(fetched.length ? fetched : staticEvents);
        setRegistrations(new Set(registrationsRes.data?.map(r => r.event_id) || []));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const channel = supabase.channel('events_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchData)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  const handleRegister = async (eventId) => {
    try {
      const { error } = await supabase.from('event_registrations').insert([{ user_id: user.id, event_id: eventId, status: 'registered' }]);
      if (error) throw error;
      setRegistrations(new Set([...registrations, eventId]));
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register for event');
    }
  };

  const handleReminder = (event) => {
    setSelectedEvent(event);
    setReminderModalOpen(true);
    setReminders(new Set([...reminders, event.id]));
  };

  const daysUntil = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  };

  return (
    <Layout title="Campus Events">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .event-card { transition: box-shadow 0.2s, border-color 0.2s; }
        .event-card:hover { box-shadow: 0 6px 24px rgba(26,21,16,0.1); }
        .remind-btn { transition: background 0.15s, color 0.15s; }
        .remind-btn:hover { background: #1a1510 !important; color: #F7F3EE !important; border-color: #1a1510 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .modal-body { animation: slideUp 0.2s ease both; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div>
          <div style={{ width: 36, height: 2, background: '#1955e6', marginBottom: '0.875rem' }} />
          <h2 className="f-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.02em', margin: '0 0 0.375rem' }}>
            Campus Events
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#8a857f' }}>
            Discover and register for upcoming activities.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite' }} />
          </div>
        ) : events.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e8e2db', padding: '4rem 2rem', textAlign: 'center' }}>
            <Calendar size={28} color="#ddd8d0" style={{ margin: '0 auto 1rem' }} />
            <h3 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', marginBottom: '0.5rem' }}>No upcoming events</h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#a0a09c' }}>Check back later for new activities.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: '#ddd8d0' }}>
            {events.map(event => {
              const isReminded = reminders.has(event.id);
              const EventIcon  = event.icon || Calendar;
              const accent     = event.accentColor || '#1955e6';
              const d          = new Date(event.start_date);

              return (
                <div key={event.id} className="event-card" style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>

                  {/* Color bar + icon header */}
                  <div style={{ height: 6, background: accent }} />
                  <div style={{ padding: '1.25rem 1.375rem 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: 40, height: 40, background: accent + '14', border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <EventIcon size={18} color={accent} />
                    </div>
                    <span style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700,
                      color: accent, letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem', background: accent + '10', border: `1px solid ${accent}25`,
                    }}>{daysUntil(event.start_date)}</span>
                  </div>

                  <div style={{ padding: '0.875rem 1.375rem 1.375rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 className="f-display" style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1a1510', lineHeight: 1.25, margin: '0 0 0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.title}
                    </h3>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', color: '#8a857f', lineHeight: 1.6, marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.description}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1.125rem' }}>
                      {[
                        { icon: Clock,  text: d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                        { icon: MapPin, text: event.location || 'TBA' },
                        { icon: Users,  text: `${event.current_attendees || 0} / ${event.max_attendees || '∞'} attendees` },
                      ].map(({ icon: Icon, text }, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon size={12} color="#c0bbb5" />
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: '#8a857f' }}>{text}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid #e8e2db', paddingTop: '1rem' }}>
                      {isReminded ? (
                        <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#f0faf4', border: '1px solid #a8dfc0', color: '#1a7a4a' }}>
                          <CheckCircle2 size={13} />
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600 }}>Reminder Set</span>
                        </div>
                      ) : (
                        <button className="remind-btn" onClick={() => handleReminder(event)} style={{
                          width: '100%', height: 36,
                          background: 'transparent', border: `1.5px solid ${accent}`,
                          color: accent, fontFamily: "'DM Sans',sans-serif",
                          fontSize: '0.75rem', fontWeight: 700,
                          letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                        }}>
                          Remind Me
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reminder modal */}
      {reminderModalOpen && selectedEvent && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(26,21,16,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-body" style={{ background: '#F7F3EE', border: '1px solid #ddd8d0', width: '100%', maxWidth: 400, padding: '1.75rem', boxShadow: '0 16px 48px rgba(26,21,16,0.16)', fontFamily: "'DM Sans',sans-serif" }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h4 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', margin: 0 }}>Reminder Set</h4>
              <button onClick={() => setReminderModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0a09c', display: 'flex' }}>
                <X size={15} />
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#4a4540', lineHeight: 1.65, marginBottom: '0.625rem' }}>
              You'll be reminded when <strong>{selectedEvent.title}</strong> is approaching.
            </p>
            <p style={{ fontSize: '0.75rem', color: '#a0a09c', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              {new Date(selectedEvent.start_date).toLocaleString()}
            </p>
            <button onClick={() => setReminderModalOpen(false)} style={{
              width: '100%', height: 40, background: '#1a1510', border: 'none',
              color: '#F7F3EE', fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
            }}>Got It</button>
          </div>
        </div>
      )}
    </Layout>
  );
}