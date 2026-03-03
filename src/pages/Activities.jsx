import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CircleCheck as CheckCircle2, BookOpen, CreditCard, Loader2, Sparkles } from 'lucide-react';

export default function Activities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllActivities = useCallback(async () => {
    try {
      // 1. Fetch recent enrollments with course names
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id, created_at, courses(course_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8);

      // 2. Fetch recent payments
      const { data: payments } = await supabase
        .from('payments')
        .select('id, created_at, description, amount, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8);

      // 3. Combine and Format
      const combined = [
        ...(enrollments || []).map(e => ({
          id: `enr-${e.id}`,
          text: `Enrolled in ${e.courses?.course_name || 'New Subject'}`,
          time: new Date(e.created_at),
          icon: BookOpen,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        })),
        ...(payments || []).map(p => ({
          id: `pay-${p.id}`,
          text: p.status === 'paid' 
            ? `Successfully paid ₱${p.amount} for ${p.description}` 
            : `New invoice generated: ₱${p.amount} for ${p.description}`,
          time: new Date(p.created_at),
          icon: p.status === 'paid' ? CheckCircle2 : CreditCard,
          color: p.status === 'paid' ? 'text-emerald-400' : 'text-amber-400',
          bgColor: p.status === 'paid' ? 'bg-emerald-500/10' : 'bg-amber-500/10',
          borderColor: p.status === 'paid' ? 'border-emerald-500/20' : 'border-amber-500/20'
        }))
      ];

      // Sort by newest first
      combined.sort((a, b) => b.time - a.time);
      setActivities(combined);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchAllActivities();

    // REALTIME SUBSCRIPTION
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'enrollments', filter: `user_id=eq.${user.id}` }, 
        () => fetchAllActivities())
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payments', filter: `user_id=eq.${user.id}` }, 
        () => fetchAllActivities())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchAllActivities]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Layout title="Activity Feed">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Recent Activity</h2>
            <p className="text-slate-400 mt-1">Tracking your academic journey and transactions.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-slate-500 animate-pulse">Synchronizing feed...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-16 text-center">
            <Clock className="h-16 w-16 mx-auto mb-4 text-slate-700" />
            <h3 className="text-xl font-medium text-slate-300">Quiet for now...</h3>
            <p className="text-slate-500 mt-2">Activities will appear here as you interact with the portal.</p>
          </div>
        ) : (
          <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {activities.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-slate-950 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <Icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  
                  {/* Content Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border bg-slate-900/40 backdrop-blur-sm transition-all hover:bg-slate-900/60 hover:shadow-xl hover:shadow-primary/5 ${activity.borderColor}">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-white text-sm md:text-base">{activity.text}</div>
                      <time className="font-medium text-xs text-primary whitespace-nowrap">{formatTime(activity.time)}</time>
                    </div>
                    <div className="text-slate-400 text-xs italic">
                      Automated System Log • {activity.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}