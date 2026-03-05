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

const S = {
  bg:      '#F7F3EE',
  bgCard:  '#ffffff',
  ink:     '#1a1510',
  ink2:    '#4a4540',
  ink3:    '#8a857f',
  ink4:    '#b0aba5',
  border:  '#ddd8d0',
  borderAlt:'#e8e2db',
  accent:  '#1955e6',
  bgInk:   '#1a1510',
};

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ enrolledCourses: 0, upcomingDeadlines: 4, pendingPayments: 0, currentGpa: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      const [enrollmentsRes, paymentsRes, profileRes, eventsRes] = await Promise.all([
        supabase.from('enrollments').select('status').eq('user_id', user.id),
        supabase.from('payments').select('status').eq('user_id', user.id),
        supabase.from('profiles').select('gpa').eq('id', user.id).single(),
        supabase.from('events').select('*').gte('start_date', new Date().toISOString()).order('start_date').limit(5),
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
          id: `enr-${e.id}`, text: `Enrolled in ${e.courses?.course_name || 'New Subject'}`,
          time: new Date(e.created_at), icon: BookOpen, tag: 'Enrollment',
        })),
        ...(paymentsRes.data || []).slice(0, 5).map(p => ({
          id: `pay-${p.id}`,
          text: p.status === 'paid' ? `Paid ₱${p.amount} for ${p.description}` : `Invoice: ₱${p.amount} for ${p.description}`,
          time: new Date(p.created_at), icon: p.status === 'paid' ? CheckCircle2 : CreditCard,
          tag: p.status === 'paid' ? 'Paid' : 'Pending',
        })),
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
    return () => supabase.removeChannel(channel);
  }, [user, fetchDashboardData]);

  const formatTime = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const statCards = [
    { label: 'Enrolled Courses',  value: stats.enrolledCourses,       icon: BookOpen,      sub: 'This semester',     href: '/app/courses'    },
    { label: 'Current GPA',       value: profile?.gpa?.toFixed(2) || '0.00', icon: TrendingUp, sub: 'Academic standing', href: '/app/grades'  },
    { label: 'Weekly Deadlines',  value: stats.upcomingDeadlines,     icon: CalendarIcon,  sub: '2 high priority',   href: '/app/enrollment' },
    { label: 'Pending Payments',  value: stats.pendingPayments,       icon: CreditCard,    sub: stats.pendingPayments > 0 ? 'Action required' : 'All clear', href: '/app/payments', warn: stats.pendingPayments > 0 },
  ];

  if (loading) return (
    <Layout title="Dashboard">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#b0aba5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Loading</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout title="Dashboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .stat-card { transition: box-shadow 0.2s, transform 0.2s; cursor: pointer; }
        .stat-card:hover { box-shadow: 0 6px 24px rgba(26,21,16,0.08); transform: translateY(-2px); }
        .activity-row { transition: background 0.15s; }
        .activity-row:hover { background: #f0ebe4 !important; }
        .quick-btn { transition: background 0.15s, color 0.15s; cursor: pointer; }
        .quick-btn:hover { background: #1a1510 !important; color: #F7F3EE !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>

        {/* Welcome banner */}
        <div style={{
          background: '#1a1510', padding: '2rem 2.25rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 500, color: '#6b6560', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Welcome back
            </p>
            <h2 className="f-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'},{' '}
              <em style={{ fontStyle: 'italic', color: '#7aabff' }}>your overview awaits.</em>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#5a5550', marginTop: '0.5rem' }}>
              Academic overview for today.
            </p>
          </div>
          <GraduationCap size={120} color="rgba(255,255,255,0.03)" style={{ position: 'absolute', right: -20, bottom: -20 }} />
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: '#ddd8d0' }}>
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="stat-card" onClick={() => navigate(card.href)} style={{ background: '#fff', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: 34, height: 34,
                    background: card.warn ? '#fff4f4' : '#F7F3EE',
                    border: `1px solid ${card.warn ? '#f8c8c8' : '#e8e2db'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} color={card.warn ? '#c83030' : '#1955e6'} />
                  </div>
                  <ArrowRight size={13} color="#c0bbb5" />
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 500, color: '#8a857f', marginTop: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.label}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: card.warn ? '#c83030' : '#b0aba5', marginTop: '0.25rem' }}>
                  {card.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-col section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#ddd8d0' }}>

          {/* Recent Activity */}
          <div style={{ background: '#fff', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ width: 28, height: 2, background: '#1955e6', marginBottom: '0.75rem' }} />
                <h3 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.015em', margin: 0 }}>
                  Recent Activity
                </h3>
              </div>
              <button onClick={() => navigate('/app/activities')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 600,
                color: '#1955e6', letterSpacing: '0.06em', textTransform: 'uppercase', padding: 0,
              }}>View all</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e2db' }}>
              {recentActivity.length > 0 ? recentActivity.map(activity => (
                <div key={activity.id} className="activity-row" style={{
                  background: '#faf8f5', padding: '0.875rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                }}>
                  <div style={{
                    width: 32, height: 32, flexShrink: 0,
                    background: '#F7F3EE', border: '1px solid #e8e2db',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <activity.icon size={14} color="#1955e6" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8375rem', fontWeight: 500, color: '#1a1510', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activity.text}
                    </p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#a0a09c', margin: '0.125rem 0 0' }}>
                      {formatTime(activity.time)}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '0.2rem 0.5rem', border: '1px solid #e8e2db',
                    color: '#8a857f', whiteSpace: 'nowrap',
                  }}>{activity.tag}</span>
                </div>
              )) : (
                <div style={{ padding: '2rem', textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8375rem', color: '#b0aba5' }}>
                  No recent activity found.
                </div>
              )}
            </div>
          </div>

          {/* Calendar / Events */}
          <div style={{ background: '#fff', padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ width: 28, height: 2, background: '#1955e6', marginBottom: '0.75rem' }} />
              <h3 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.015em', margin: 0 }}>
                Upcoming Events
              </h3>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e2db' }}>
              {upcomingEvents.length > 0 ? upcomingEvents.map(event => {
                const d = new Date(event.start_date);
                const isToday = new Date().toDateString() === d.toDateString();
                return (
                  <div key={event.id} style={{
                    background: isToday ? '#f0f4ff' : '#faf8f5',
                    padding: '0.875rem 1rem',
                    display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                    borderLeft: isToday ? '2px solid #1955e6' : '2px solid transparent',
                  }}>
                    <div style={{
                      width: 40, flexShrink: 0, textAlign: 'center',
                      background: isToday ? '#1955e6' : '#F7F3EE',
                      border: `1px solid ${isToday ? '#1955e6' : '#e8e2db'}`,
                      padding: '0.25rem 0',
                    }}>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.6rem', fontWeight: 600, color: isToday ? 'rgba(255,255,255,0.7)' : '#a0a09c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {d.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', fontWeight: 700, color: isToday ? '#fff' : '#1a1510', lineHeight: 1.1 }}>
                        {d.getDate()}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8375rem', fontWeight: 600, color: '#1a1510', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {event.title}
                      </p>
                      <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#8a857f', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={10} />{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#8a857f', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={10} />{event.location || 'TBD'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', background: '#faf8f5' }}>
                  <Bell size={28} color="#ddd8d0" style={{ marginBottom: '0.75rem' }} />
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#c0bbb5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>No upcoming events</p>
                </div>
              )}
            </div>

            <button style={{
              marginTop: '1rem', width: '100%', height: 38,
              background: 'transparent', border: '1.5px solid #ddd8d0',
              fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 600,
              color: '#8a857f', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1510'; e.currentTarget.style.color = '#1a1510'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd8d0'; e.currentTarget.style.color = '#8a857f'; }}>
              Sync Google Calendar
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#1a1510', padding: '2rem 2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 className="f-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em', margin: '0 0 0.25rem' }}>
              Quick Actions
            </h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', color: '#5a5550', margin: 0 }}>
              One-tap shortcuts to your portal
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            {['Enrollment', 'Grades', 'Advising', 'Payments'].map(action => (
              <button key={action} className="quick-btn" onClick={() => navigate(`/app/${action.toLowerCase()}`)} style={{
                background: 'transparent', border: '1.5px solid #2e2820',
                color: '#8a857f', fontFamily: "'DM Sans',sans-serif",
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '0.625rem 1.25rem',
              }}>
                {action}
              </button>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}