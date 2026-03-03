import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Calendar, DollarSign, BookOpen, TrendingUp, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    upcomingDeadlines: 0,
    pendingPayments: 0,
    completedCredits: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [enrollmentsRes, paymentsRes, eventsRes] = await Promise.all([
          supabase
            .from('enrollments')
            .select('*, courses(*)')
            .eq('user_id', user.id)
            .eq('status', 'active'),
          supabase
            .from('payments')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'pending'),
          supabase
            .from('events')
            .select('*')
            .gte('start_date', new Date().toISOString())
            .order('start_date', { ascending: true })
            .limit(3),
        ]);

        setStats({
          enrolledCourses: enrollmentsRes.data?.length || 0,
          upcomingDeadlines: 4,
          pendingPayments: paymentsRes.data?.length || 0,
          completedCredits: profile?.total_credits || 0,
        });

        setUpcomingEvents(eventsRes.data || []);

        setRecentActivity([
          { type: 'grade', text: 'Grade posted: Data Structures - A', time: '2 hours ago', icon: CheckCircle2, color: 'text-success' },
          { type: 'deadline', text: 'Assignment due: Machine Learning Lab', time: 'Tomorrow, 11:59 PM', icon: Clock, color: 'text-warning' },
          { type: 'enrollment', text: 'Enrolled in Advanced Algorithms', time: 'Yesterday', icon: BookOpen, color: 'text-primary' },
          { type: 'payment', text: 'Payment reminder: Tuition Fee', time: '3 days ago', icon: AlertCircle, color: 'text-destructive' },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();

    const channel = supabase
      .channel('dashboard_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enrollments', filter: `user_id=eq.${user.id}` },
        () => fetchDashboardData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments', filter: `user_id=eq.${user.id}` },
        () => fetchDashboardData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  const statCards = [
    { label: 'Enrolled Courses', value: stats.enrolledCourses, icon: BookOpen, color: 'bg-blue-500', change: '+2 this semester' },
    { label: 'Current GPA', value: profile?.gpa?.toFixed(2) || '0.00', icon: TrendingUp, color: 'bg-green-500', change: '+0.15 vs last term' },
    { label: 'Deadlines This Week', value: stats.upcomingDeadlines, icon: Calendar, color: 'bg-orange-500', change: '2 high priority' },
    { label: 'Pending Payments', value: stats.pendingPayments, icon: DollarSign, color: 'bg-red-500', change: stats.pendingPayments > 0 ? 'Action required' : 'All clear' },
  ];

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-4" />
              <div className="h-8 bg-muted rounded w-1/3" />
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            Welcome back, {profile?.full_name || 'Student'}
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your academics today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${stat.color} rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <button className="text-sm text-primary hover:underline font-medium">View all</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="flex-shrink-0">
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
              <button className="text-sm text-primary hover:underline font-medium">Browse events</button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex flex-col items-center justify-center border border-primary/20">
                      <span className="text-xs font-medium text-primary">
                        {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {new Date(event.start_date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{event.location}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No upcoming events</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
              <p className="text-white/80 text-sm mb-4">Get things done faster with these shortcuts</p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
                  Add/Drop Courses
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
                  View Grades
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
                  Book Advising
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
                  Pay Fees
                </button>
              </div>
            </div>
            <GraduationCap className="h-24 w-24 opacity-20 hidden lg:block" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
