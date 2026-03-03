import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MessageSquare, User, Mail, Phone, MapPin, Clock, Plus } from 'lucide-react';

export default function Advising() {
  const { user } = useAuth();
  const [advisors, setAdvisors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [advisorsRes, sessionsRes, messagesRes] = await Promise.all([
          supabase.from('advisors').select('*').limit(3),
          supabase
            .from('advising_sessions')
            .select('*, advisors(*)')
            .eq('student_id', user.id)
            .order('scheduled_at', { ascending: true }),
          supabase
            .from('messages')
            .select('*')
            .eq('recipient_id', user.id)
            .order('created_at', { ascending: false})
            .limit(5),
        ]);

        setAdvisors(advisorsRes.data || []);
        setSessions(sessionsRes.data || []);
        setMessages(messagesRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Layout title="Advising">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-card border border-border rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Academic Advising">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Academic Advising</h2>
            <p className="text-muted-foreground mt-1">Connect with your advisor and schedule appointments</p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Your Advisors</h3>
              <div className="space-y-4">
                {advisors.map((advisor) => (
                  <div
                    key={advisor.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 flex-shrink-0">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{advisor.full_name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{advisor.department}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{advisor.email}</span>
                        </div>
                        {advisor.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{advisor.phone}</span>
                          </div>
                        )}
                        {advisor.office_location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{advisor.office_location}</span>
                          </div>
                        )}
                        {advisor.office_hours && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{advisor.office_hours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      Contact
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Appointments</h3>
              <div className="space-y-3">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg"
                    >
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {session.advisors?.full_name || 'Advisor'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.scheduled_at).toLocaleString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-warning/10 text-warning text-xs font-semibold rounded">
                        {session.meeting_type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                    <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Messages</h3>
              <div className="space-y-3">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-all ${
                        !message.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {!message.read && <div className="h-2 w-2 bg-primary rounded-full" />}
                        <p className="text-sm font-medium text-foreground truncate">
                          {message.subject || 'No subject'}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{message.body}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                    <p className="text-sm text-muted-foreground">No messages</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-white/80 mb-4">
                Schedule a meeting with your advisor to discuss your academic progress and future plans.
              </p>
              <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors">
                Schedule Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
