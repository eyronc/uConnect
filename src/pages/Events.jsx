import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Users, Clock, CircleCheck as CheckCircle2 } from 'lucide-react';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState(new Set());
  const [loading, setLoading] = useState(true);

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

        setEvents(eventsRes.data || []);
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
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Campus Events</h2>
          <p className="text-muted-foreground mt-1">
            Discover and register for upcoming events and activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isRegistered = registrations.has(event.id);
            const spotsLeft = (event.max_attendees || 0) - (event.current_attendees || 0);

            return (
              <div
                key={event.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-primary opacity-30" />
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
                    {isRegistered ? (
                      <div className="flex items-center gap-2 justify-center px-4 py-2 bg-success/10 text-success rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Registered</span>
                      </div>
                    ) : spotsLeft > 0 || !event.max_attendees ? (
                      <button
                        onClick={() => handleRegister(event.id)}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Register Now
                      </button>
                    ) : (
                      <div className="text-center px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium">
                        Event Full
                      </div>
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
