import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, Calendar, MapPin, UserPlus, CircleCheck as CheckCircle2, 
  Code, Palette, BarChart3, Heart, Zap, X, Clock 
} from 'lucide-react';

export default function Clubs() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [memberships, setMemberships] = useState(new Set()); // Only 'active' status
  const [pendingApplications, setPendingApplications] = useState(new Set()); // Only 'pending' status
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [applicationForm, setApplicationForm] = useState({ reason: '', interests: '' });

  const staticClubs = [
    { id: 'static-1', name: 'Programming & Coding Club', description: 'Learn and collaborate on programming projects. From web development to competitive coding.', meeting_schedule: 'Tue & Thu 6 PM', location: 'Lab 1', member_count: 45, icon: Code, gradient: 'from-blue-600 to-indigo-600' },
    { id: 'static-2', name: 'Design & Creative Arts', description: 'Express yourself through digital and traditional art. Share creations and learn from peers.', meeting_schedule: 'Wed 5 PM', location: 'Arts Studio', member_count: 32, icon: Palette, gradient: 'from-pink-500 to-rose-500' },
    { id: 'static-3', name: 'Business & Entrepreneurship', description: 'Build business skills, network with innovators, and launch startup ideas with mentors.', meeting_schedule: 'Mon 7 PM', location: 'Business Center', member_count: 38, icon: BarChart3, gradient: 'from-emerald-500 to-teal-600' },
    { id: 'static-4', name: 'Community Service', description: 'Make a difference in the community through volunteer projects and social initiatives.', meeting_schedule: 'Sat 9 AM', location: 'Student Center', member_count: 56, icon: Heart, gradient: 'from-orange-500 to-red-500' },
    { id: 'static-5', name: 'Innovation Lab', description: 'Explore cutting-edge science, conduct experiments, and collaborate on research projects.', meeting_schedule: 'Fri 4 PM', location: 'Science Lab 3', member_count: 28, icon: Zap, gradient: 'from-amber-400 to-orange-500' },
    { id: 'static-6', name: 'Cultural Exchange', description: 'Celebrate diversity through events, food, and cultural exchanges from around the world.', meeting_schedule: 'Sun 6 PM', location: 'Hall A', member_count: 41, icon: Users, gradient: 'from-violet-500 to-purple-600' },
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

        // Separate IDs into Active (Members) and Pending (Applied)
        const active = new Set();
        const pending = new Set();

        membershipsRes.data?.forEach(row => {
          if (row.status === 'active') active.add(row.club_id);
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
      const { error } = await supabase.from('club_memberships').insert([
        { 
          user_id: user.id, 
          club_id: selectedClub.id, 
          status: 'pending',
          reason: applicationForm.reason, // Assumes you added this column to your DB
          interests: applicationForm.interests // Assumes you added this column to your DB
        },
      ]);
      
      if (error) throw error;

      // Update UI state to show as pending
      setPendingApplications(prev => new Set([...prev, selectedClub.id]));
      setApplicationModalOpen(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Layout title="Clubs">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-slate-200 rounded-2xl" />)}
      </div>
    </Layout>
  );

  return (
    <Layout title="Student Clubs">
      <div className="space-y-8 pb-12">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Community.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">Join student-led organizations to develop new skills and build your network.</p>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
        </div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isMember = memberships.has(club.id);
            const isPending = pendingApplications.has(club.id);
            const ClubIcon = club.icon || Users;

            return (
              <div key={club.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col">
                <div className={`h-32 bg-gradient-to-br ${club.gradient || 'from-slate-700 to-slate-900'} relative`}>
                  <div className="absolute bottom-[-24px] left-6 p-4 bg-white rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ClubIcon className="h-8 w-8 text-slate-700" />
                  </div>
                </div>

                <div className="p-6 pt-10 flex-grow space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{club.name}</h3>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">{club.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight text-slate-500 bg-slate-50 p-2 rounded-lg">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      {club.meeting_schedule}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight text-slate-500 bg-slate-50 p-2 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      {club.location}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  {isMember ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center gap-2 font-bold text-sm border border-emerald-100 shadow-sm">
                      <CheckCircle2 className="h-4 w-4" /> Joined Club
                    </div>
                  ) : isPending ? (
                    <div className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center gap-2 font-bold text-sm border border-slate-200 shadow-inner">
                      <Clock className="h-4 w-4" /> Application Pending
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleOpenApplication(club)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" /> Join Club
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Logic Remains the same as previous refined version */}
        {applicationModalOpen && selectedClub && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className={`h-2 bg-gradient-to-r ${selectedClub.gradient || 'from-blue-600 to-indigo-600'}`} />
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-2xl font-black text-slate-900">Apply to Join</h4>
                    <p className="text-slate-500 text-sm font-medium">{selectedClub.name}</p>
                  </div>
                  <button onClick={() => setApplicationModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 uppercase">Statement of Interest</label>
                    <textarea
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
                      rows={4}
                      value={applicationForm.reason}
                      onChange={(e) => setApplicationForm({...applicationForm, reason: e.target.value})}
                      placeholder="Why do you want to join?"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 uppercase">Relevant Skills</label>
                    <input
                      type="text"
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                      value={applicationForm.interests}
                      onChange={(e) => setApplicationForm({...applicationForm, interests: e.target.value})}
                      placeholder="e.g. Design, Coding, etc."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}