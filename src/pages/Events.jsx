import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Users, Clock, CircleCheck as CheckCircle2, Trophy, Music, BookOpen, Zap, Briefcase, Palette, X } from 'lucide-react';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState(new Set());
  const [reminders, setReminders] = useState(new Set());
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Static events to display when database has none
  const staticEvents = [
    {
      id: 'static-1',
      title: 'Intramurals - Basketball Tournament',
      description: 'Join the exciting basketball tournament featuring teams from all departments. Register your team and compete for the championship!',
      start_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Sports Complex, Court 1',
      max_attendees: 150,
      current_attendees: 45,
      icon: Trophy,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: 'static-2',
      title: 'UC Days Festival',
      description: 'Annual campus celebration featuring food booths, live performances, games, and activities. A day full of fun and community spirit!',
      start_date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Main Quad',
      max_attendees: 500,
      current_attendees: 120,
      icon: Music,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'static-3',
      title: 'Exam Week Support Sessions',
      description: 'Free tutoring and review sessions for all courses. Meet with instructors and peer tutors to prepare for final exams.',
      start_date: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Library, Multiple Rooms',
      max_attendees: 300,
      current_attendees: 87,
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'static-4',
      title: 'Tech Symposium 2026',
      description: 'Industry leaders and innovators discuss the latest in technology, AI, and digital transformation. Network with professionals and peers.',
      start_date: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Convention Center, Hall A',
      max_attendees: 200,
      current_attendees: 73,
      icon: Zap,
      gradient: 'from-yellow-500 to-amber-500',
    },
    {
      id: 'static-5',
      title: 'Career Fair 2026',
      description: 'Connect with top companies hiring. Browse booths, submit resumes, and interview with HR representatives from major corporations.',
      start_date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Student Center Ballroom',
      max_attendees: 400,
      current_attendees: 156,
      icon: Briefcase,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 'static-6',
      title: 'Art & Culture Showcase',
      description: 'Showcase of student artwork, performances, and cultural exhibitions. Celebrate creativity and diversity across campus.',
      start_date: new Date(new Date().getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Arts Building Gallery',
      max_attendees: 250,
      current_attendees: 62,
      icon: Palette,
      gradient: 'from-indigo-500 to-violet-500',
    },
  ];

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [eventsRes, registrationsRes] = await Promise.all([
          supabase
            .from('events')
            .select('*')
            .gte('start_date', new Date().toISOString())
            .order('start_date', { ascending: true }),
          supabase
            .from('event_registrations')
            .select('event_id')
            .eq('user_id', user.id)
            .eq('status', 'registered'),
        ]);

        // Use static events as fallback if database returns None
        const fetched = eventsRes.data || [];
        setEvents(fetched.length ? fetched : staticEvents);
        setRegistrations(new Set(registrationsRes.data?.map((r) => r.event_id) || []));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchData();

    const channel = supabase
      .channel('events_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleRegister = async (eventId) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([{ user_id: user.id, event_id: eventId, status: 'registered' }]);

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

  if (loading) {
    return (
      <Layout title="Events">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-card border border-border rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Campus Events">
      <div className="space-y-6">
        {/* reminder confirmation modal */}
        {reminderModalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Reminder Set</h4>
                <button onClick={() => setReminderModalOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You will be reminded when <strong>{selectedEvent.title}</strong> is almost happening.
                </p>
                <p className="text-xs text-muted-foreground">
                  Scheduled for: {new Date(selectedEvent.start_date).toLocaleString()}
                </p>
                <button
                  onClick={() => setReminderModalOpen(false)}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold text-white">Campus Events</h2>
          <p className="text-muted-foreground mt-1">
            Discover and register for upcoming events and activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isReminded = reminders.has(event.id);
            const EventIcon = event.icon || Calendar;
            const gradientClass = event.gradient || 'from-primary/20 to-primary/5';

            return (
              <div
                key={event.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className={`h-40 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                  <EventIcon className="h-16 w-16 text-white opacity-60" />
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(event.start_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.current_attendees || 0}/{event.max_attendees || '∞'} attendees
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    {isReminded ? (
                      <div className="flex items-center gap-2 justify-center px-4 py-2 bg-success/10 text-success rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Reminder Set</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReminder(event)}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Remind Me
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">Check back later for new events and activities</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
