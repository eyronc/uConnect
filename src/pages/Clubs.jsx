import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Calendar, MapPin, UserPlus, CircleCheck as CheckCircle2 } from 'lucide-react';

export default function Clubs() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [memberships, setMemberships] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [clubsRes, membershipsRes] = await Promise.all([
          supabase.from('clubs').select('*').eq('status', 'active'),
          supabase
            .from('club_memberships')
            .select('club_id')
            .eq('user_id', user.id)
            .eq('status', 'active'),
        ]);

        setClubs(clubsRes.data || []);
        setMemberships(new Set(membershipsRes.data?.map((m) => m.club_id) || []));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleJoin = async (clubId) => {
    try {
      const { error } = await supabase
        .from('club_memberships')
        .insert([{ user_id: user.id, club_id: clubId, status: 'active' }]);

      if (error) throw error;

      setMemberships(new Set([...memberships, clubId]));
    } catch (error) {
      console.error('Error joining club:', error);
      alert('Failed to join club');
    }
  };

  if (loading) {
    return (
      <Layout title="Clubs">
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
    <Layout title="Student Clubs">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Student Organizations</h2>
          <p className="text-muted-foreground mt-1">
            Join clubs and connect with students who share your interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isMember = memberships.has(club.id);

            return (
              <div
                key={club.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary opacity-30" />
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{club.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {club.description || 'No description available'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {club.meeting_schedule && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{club.meeting_schedule}</span>
                      </div>
                    )}
                    {club.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{club.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{club.member_count || 0} members</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    {isMember ? (
                      <div className="flex items-center gap-2 justify-center px-4 py-2 bg-success/10 text-success rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Member</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoin(club.id)}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Join Club</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {clubs.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No clubs available</h3>
            <p className="text-muted-foreground">Check back later for new student organizations</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
