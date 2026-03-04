import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Trophy, BookOpen, Percent, 
  TrendingUp, Award, Clock, 
  Inbox, ChevronRight
} from 'lucide-react';

export default function Grades() {
  const { user, profile } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Unified Fetch Function
  const fetchGrades = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*, courses(*)')
        .eq('user_id', user.id)
        .order('graded_at', { ascending: false });
      
      if (error) throw error;
      setGrades(data || []);
    } catch (err) {
      console.error('Error fetching grades:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 2. Realtime Subscription
  useEffect(() => {
    if (!user) return;

    fetchGrades();

    // Listen for changes in the 'grades' table for this specific user
    const channel = supabase
      .channel('realtime_grades')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'grades', filter: `user_id=eq.${user.id}` },
        () => fetchGrades()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchGrades]);

  if (loading) {
    return (
      <Layout title="Grades">
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Grades...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Grades">
      <div className="max-w-7xl mx-auto space-y-8 pb-12 font-['Inter']">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-10 border border-white/5 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">Academic Performance</h2>
              <p className="text-slate-400 mt-2 text-lg font-medium">Your real-time assessment and GPA tracker.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-md">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Current GPA</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <span className="text-3xl font-black text-white">{profile?.gpa?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
          <Award className="absolute -bottom-10 -right-10 h-64 w-64 text-white/[0.02] -rotate-12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Grades List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-3 px-2">
              <div className="h-6 w-1 bg-blue-500 rounded-full" />
              Recent Assessments
            </h3>

            {grades.length === 0 ? (
              <div className="bg-slate-900/40 border border-dashed border-white/10 rounded-[2rem] p-20 text-center">
                <Inbox className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No grades posted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {grades.map((g) => (
                  <div
                    key={g.id}
                    className="group bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:bg-slate-800/50 transition-all flex items-center justify-between backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">
                          {g.courses?.course_name || 'Course Name'}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{g.assessment_name}</span>
                          <span className="h-1 w-1 bg-slate-700 rounded-full" />
                          <span className="text-[10px] font-bold text-slate-600 italic">
                            {new Date(g.graded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {g.score !== null ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xl font-black text-white font-mono">
                            {g.score}<span className="text-slate-600 text-sm ml-1">/ {g.max_score}</span>
                          </span>
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md mt-1">
                            {g.percentage?.toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
             <h3 className="text-xl font-black text-white flex items-center gap-3 px-2">
              Summary
            </h3>
            
            <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400"><Clock className="h-4 w-4" /></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">In Progress</span>
                </div>
                <span className="text-white font-black">{grades.filter(g => g.score === null).length} Subjects</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Trophy className="h-4 w-4" /></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed</span>
                </div>
                <span className="text-white font-black">{grades.filter(g => g.score !== null).length} Exams</span>
              </div>

              <div className="pt-6 border-t border-white/5">
                 <button className="w-full group flex items-center justify-between p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-900/20">
                    <span className="text-xs font-black uppercase tracking-widest">Request Review</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}