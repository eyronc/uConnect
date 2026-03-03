import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, MessageSquare, User, Mail, MapPin, 
  Clock, Plus, X, Video, Info 
} from 'lucide-react';
import { toast } from 'sonner';

export default function Advising() {
  const { user } = useAuth();
  const [advisors, setAdvisors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    advisor_id: '',
    scheduled_at: '',
    meeting_type: 'virtual'
  });

  // Updated with more courses/departments
  const staticAdvisors = [
    { id: 'static-1', full_name: 'Dr. Maria Santos', department: 'IT & Computer Science', email: 'm.santos@edu.ph', office_location: 'Bldg A-101', office_hours: 'M/W 2-4pm' },
    { id: 'static-2', full_name: 'Prof. Juan Dela Cruz', department: 'Mathematics', email: 'j.delacruz@edu.ph', office_location: 'Bldg B-203', office_hours: 'T/TH 10-12pm' },
    { id: 'static-3', full_name: 'Engr. Elena Wright', department: 'Civil Engineering', email: 'e.wright@edu.ph', office_location: 'Eng Lab 2', office_hours: 'Friday 1-5pm' },
    { id: 'static-4', full_name: 'Dr. Ricardo Gomez', department: 'Business Administration', email: 'r.gomez@edu.ph', office_location: 'Biz Wing B-12', office_hours: 'T/TH 9-11am' }
  ];

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [advRes, sessRes, msgRes] = await Promise.all([
        supabase.from('advisors').select('*'),
        supabase.from('advising_sessions').select('*, advisors(*)').eq('student_id', user.id).order('scheduled_at', { ascending: true }),
        supabase.from('messages').select('*').eq('recipient_id', user.id).order('created_at', { ascending: false }).limit(3)
      ]);
      // Only use static data if the database is actually empty
      setAdvisors(advRes.data?.length ? advRes.data : staticAdvisors);
      setSessions(sessRes.data || []);
      setMessages(msgRes.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleBookSession = async (e) => {
    e.preventDefault();
    
    // SAFETY CHECK: Prevents trying to save "static-1" to a UUID column
    if (formData.advisor_id.startsWith('static')) {
      alert("Error: You are using demo data. Please run the SQL INSERT script in Supabase to create real advisors first.");
      return;
    }

    const { error } = await supabase
      .from('advising_sessions')
      .insert([{
        student_id: user.id,
        advisor_id: formData.advisor_id,
        scheduled_at: formData.scheduled_at,
        meeting_type: formData.meeting_type,
        status: 'scheduled'
      }]);

    if (error) {
      alert("Booking failed: " + error.message);
    } else {
      setBookingModalOpen(false);
      fetchData();
      setFormData({ advisor_id: '', scheduled_at: '', meeting_type: 'virtual' });
      toast.success("Session scheduled!");
    }
  };

  return (
    <Layout title="Advising">
      <div className="max-w-[1200px] mx-auto p-6 space-y-8 animate-in fade-in duration-500">
        
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Success Center</h1>
            <p className="text-zinc-400 text-sm">Academic guidance and session management.</p>
          </div>
          <button 
            onClick={() => setBookingModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Book Session
          </button>
        </header>

        {/* Advisor Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-zinc-400">
            <User className="w-4 h-4" />
            <h2 className="text-xs font-bold uppercase tracking-widest">Department Faculty</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advisors.map((advisor) => (
              <div key={advisor.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-blue-500/50 transition-all">
                <h3 className="font-bold text-white">{advisor.full_name}</h3>
                <p className="text-xs text-blue-400 font-medium mb-3">{advisor.department}</p>
                <div className="space-y-1 text-[11px] text-zinc-500 border-t border-white/5 pt-3">
                  <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {advisor.office_location}</div>
                  <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> {advisor.office_hours}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal */}
        {bookingModalOpen && (
          <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Schedule Session</h2>
                <button onClick={() => setBookingModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleBookSession} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Advisor</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    value={formData.advisor_id}
                    onChange={(e) => setFormData({...formData, advisor_id: e.target.value})}
                    required
                  >
                    <option value="" className="bg-zinc-900 text-zinc-500">Choose a mentor...</option>
                    {advisors.map(a => (
                      <option key={a.id} value={a.id} className="bg-zinc-900">
                        {a.full_name} — {a.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preferred Date & Time</label>
                  <input 
                    type="datetime-local"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none [color-scheme:dark]"
                    onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['virtual', 'in-person'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, meeting_type: type})}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all capitalize ${formData.meeting_type === type ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 border-white/10 text-zinc-500'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl mt-4 shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all"
                >
                  Confirm Appointment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}