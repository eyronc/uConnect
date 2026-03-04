import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  GraduationCap, Calendar as CalendarIcon, BookOpen, 
  TrendingUp, Clock, CircleCheck as CheckCircle2, 
  CreditCard, ArrowRight, Zap, MapPin, Bell
} from 'lucide-react';

export default function Dashboard() {
  const { user, profile} = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    upcomingDeadlines: 4, 
    pendingPayments: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  
  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString();
      const [enrollmentsRes, paymentsRes, profileRes] = await Promise.all([
        supabase.from('enrollments').select('status').eq('user_id', user.id),
        supabase.from('payments').select('status').eq('user_id', user.id),
        supabase.from('profiles').select('gpa').eq('id', user.id).single(),
      ]);

      setStats({
        enrolledCourses: enrollmentsRes.data?.filter(e => e.status === 'active').length || 0,
        upcomingDeadlines: 0,
        pendingPayments: paymentsRes.data?.filter(p => p.status === 'pending').length || 0,
        currentGpa: profileRes.data?.gpa || 0,
      });

      setUpcomingEvents(eventsRes.data || []);

      const combined = [
        ...(enrollmentsRes.data || []).slice(0, 5).map(e => ({
          id: `enr-${e.id}`,
          text: `Enrolled in ${e.courses?.course_name || 'New Subject'}`,
          time: new Date(e.created_at),
          icon: BookOpen,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10'
        })),
        ...(paymentsRes.data || []).slice(0, 5).map(p => ({
          id: `pay-${p.id}`,
          text: p.status === 'paid' 
            ? `Paid ₱${p.amount} for ${p.description}` 
            : `Invoice: ₱${p.amount} for ${p.description}`,
          time: new Date(p.created_at),
          icon: p.status === 'paid' ? CheckCircle2 : CreditCard,
          color: p.status === 'paid' ? 'text-emerald-400' : 'text-amber-400',
          bgColor: p.status === 'paid' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
        }))
      ];

      setRecentActivity(combined.sort((a, b) => b.time - a.time).slice(0, 4));
    } catch (error) {
      console.error('Dashboard Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();

    const channel = supabase.channel('dashboard_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments', filter: `user_id=eq.${user.id}` }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments', filter: `user_id=eq.${user.id}` }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchDashboardData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchDashboardData]);

  const formatTime = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const statCards = [
    { label: 'Enrolled Courses', value: stats.enrolledCourses, icon: BookOpen, color: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/20', change: '+2 this semester', href: '/app/courses' },
    { label: 'Current GPA', value: profile?.gpa?.toFixed(2) || '0.00', icon: TrendingUp, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20', change: '+0.15 vs last term', href: '/app/grades' },
    { label: 'Weekly Deadlines', value: stats.upcomingDeadlines, icon: CalendarIcon, color: 'from-orange-500 to-amber-600', shadow: 'shadow-orange-500/20', change: '2 high priority', href: '/app/enrollment' },
    { label: 'Pending Payments', value: stats.pendingPayments, isCurrency: true, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20', change: stats.pendingPayments > 0 ? 'Action required' : 'All clear', href: '/app/payments' },
  ];

  if (loading) return <Layout title="Dashboard"><div className="flex items-center justify-center min-h-[60vh] text-white font-black animate-pulse uppercase tracking-[0.3em]">Syncing Core...</div></Layout>;

  return (
    <Layout title="Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto pb-12 font-['Inter']">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 border border-white/5 shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white tracking-tight">
              Welcome back, <span className="text-blue-400">
                {/* Prioritize the updated profile name, then fallback to email, then 'Student' */}
                {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'}
              </span>
            </h2>
            <p className="text-slate-400 mt-2 text-lg font-medium">Your academic overview for today.</p>
          </div>
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(stat.href)}
                className={`group bg-slate-950/50 backdrop-blur-xl border border-white/5 p-7 rounded-[2rem] hover:border-white/20 transition-all duration-300 cursor-pointer hover:-translate-y-2 ${stat.shadow}`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  {stat.isCurrency ? (
                    <span className="text-2xl font-black text-white italic">₱</span>
                  ) : (
                    <Icon className="h-7 w-7 text-white" />
                  )}
                </div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-4xl font-black text-white mt-2 font-mono">{stat.value}</h3>
                <div className="flex items-center gap-1.5 mt-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5 group-hover:bg-white/10 transition-colors">
                        {stat.change}
                    </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-3 bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-400" /> Recent Activity
              </h3>
              <button onClick={() => navigate('/app/activities')} className="text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-5 p-5 rounded-2xl bg-slate-900/40 border border-white/[0.03] hover:border-white/10 hover:bg-slate-900/80 transition-all group">
                    <div className={`p-3.5 rounded-xl ${activity.bgColor} ${activity.color}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{activity.text}</p>
                      <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500 mt-1 flex items-center gap-1.5 opacity-70">
                          <Clock className="h-3 w-3" /> {formatTime(activity.time)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-slate-500 font-medium">No recent activity found.</p>
              )}
            </div>
          </div>

          {/* Functional Calendar Section */}
          <div className="lg:col-span-2 bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white">Calendar</h3>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <CalendarIcon className="h-4 w-4 text-blue-400" />
                </div>
            </div>
            
            <div className="space-y-5 flex-1">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => {
                    const eventDate = new Date(event.start_date);
                    const isToday = new Date().toDateString() === eventDate.toDateString();
                    
                    return (
                        <div key={event.id} className="relative group">
                            {isToday && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            )}
                            <div className="flex gap-5 p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] group-hover:bg-white/[0.05] group-hover:border-white/10 transition-all duration-300">
                                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-colors ${isToday ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-900 border-white/5'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${isToday ? 'text-blue-100' : 'text-slate-500'}`}>
                                        {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                    <span className={`text-xl font-black ${isToday ? 'text-white' : 'text-slate-200'}`}>
                                        {eventDate.getDate()}
                                    </span>
                                </div>
                                
                                <div className="flex-1 min-w-0 py-1">
                                    <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                        {event.title}
                                    </h4>
                                    <div className="flex flex-col gap-1 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                            <Clock className="h-3 w-3" />
                                            {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                            <MapPin className="h-3 w-3 text-rose-500/50" />
                                            {event.location || 'Online / TBD'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                    <Bell className="h-10 w-10 text-slate-600 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">No Upcoming Events</p>
                </div>
              )}
            </div>
            
            <button className="mt-8 w-full py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white hover:text-slate-950 text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all duration-300">
                Sync Google Calendar
            </button>
          </div>
        </div>

        {/* Quick Actions Footer Card */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white mb-2">Quick Actions</h3>
            <p className="text-blue-200/60 mb-8 max-w-sm font-medium">Navigate through your academic portal with one-tap shortcuts.</p>
            <div className="flex flex-wrap gap-4">
              {['Enrollment', 'Grades', 'Advising', 'Payments'].map((action) => (
                <button 
                  key={action}
                  onClick={() => navigate(`/app/${action.toLowerCase() === 'enrollment' ? 'enrollment' : action.toLowerCase()}`)}
                  className="px-8 py-3 bg-white/5 hover:bg-white text-white hover:text-blue-900 rounded-xl text-xs font-black uppercase tracking-widest backdrop-blur-md transition-all border border-white/10 hover:border-white shadow-xl transform hover:scale-105 active:scale-95"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
          <GraduationCap className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 rotate-12 group-hover:rotate-0 transition-all duration-1000 ease-out" />
        </div>

      </div>
    </Layout>
  );
}