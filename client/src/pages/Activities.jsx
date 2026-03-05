import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CircleCheck as CheckCircle2, BookOpen, CreditCard } from 'lucide-react';

export default function Activities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllActivities = useCallback(async () => {
    try {
      const [{ data: enrollments }, { data: payments }] = await Promise.all([
        supabase.from('enrollments').select('id, created_at, courses(course_name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(8),
        supabase.from('payments').select('id, created_at, description, amount, status').eq('user_id', user.id).order('created_at', { ascending: false }).limit(8),
      ]);

      const combined = [
        ...(enrollments || []).map(e => ({
          id: `enr-${e.id}`,
          text: `Enrolled in ${e.courses?.course_name || 'New Subject'}`,
          time: new Date(e.created_at),
          icon: BookOpen,
          tag: 'Enrollment',
          tagColor: '#1955e6',
          tagBg: '#eef3ff',
          tagBorder: '#c5d3ff',
        })),
        ...(payments || []).map(p => ({
          id: `pay-${p.id}`,
          text: p.status === 'paid'
            ? `Paid ₱${p.amount} for ${p.description}`
            : `Invoice generated: ₱${p.amount} for ${p.description}`,
          time: new Date(p.created_at),
          icon: p.status === 'paid' ? CheckCircle2 : CreditCard,
          tag: p.status === 'paid' ? 'Paid' : 'Pending',
          tagColor: p.status === 'paid' ? '#1a7a4a' : '#b07020',
          tagBg:    p.status === 'paid' ? '#f0faf4' : '#fffbeb',
          tagBorder:p.status === 'paid' ? '#a8dfc0' : '#f5d87a',
        })),
      ].sort((a, b) => b.time - a.time);

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
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments', filter: `user_id=eq.${user.id}` }, fetchAllActivities)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments',    filter: `user_id=eq.${user.id}` }, fetchAllActivities)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user, fetchAllActivities]);

  const formatTime = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Layout title="Activity Feed">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .activity-item { animation: fadeUp 0.4s ease both; }
        .activity-row:hover { background: #f0ebe4 !important; }
      `}</style>

      <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: '2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ width: 36, height: 2, background: '#1955e6', marginBottom: '0.875rem' }} />
          <h2 className="f-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.02em', margin: '0 0 0.375rem' }}>
            Recent Activity
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#8a857f' }}>
            Tracking your academic journey and transactions.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
            <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite' }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#b0aba5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Synchronizing feed…
            </p>
          </div>
        ) : activities.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e8e2db', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, background: '#F7F3EE', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Clock size={20} color="#c0bbb5" />
            </div>
            <h3 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', marginBottom: '0.5rem' }}>Quiet for now</h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#a0a09c' }}>
              Activities will appear here as you interact with the portal.
            </p>
          </div>
        ) : (
          /* Timeline */
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 19, top: 0, bottom: 0,
              width: 1, background: 'linear-gradient(to bottom, transparent, #ddd8d0 10%, #ddd8d0 90%, transparent)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {activities.map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="activity-item" style={{ animationDelay: `${idx * 60}ms`, display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>

                    {/* Icon dot */}
                    <div style={{
                      width: 38, height: 38, flexShrink: 0,
                      background: '#fff', border: '1px solid #ddd8d0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative', zIndex: 1,
                    }}>
                      <Icon size={15} color="#1955e6" />
                    </div>

                    {/* Card */}
                    <div className="activity-row" style={{
                      flex: 1, background: '#fff', border: '1px solid #e8e2db',
                      padding: '0.875rem 1.125rem', marginBottom: 1,
                      transition: 'background 0.15s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 500, color: '#1a1510', margin: 0, flex: 1 }}>
                          {activity.text}
                        </p>
                        <span style={{
                          fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          padding: '0.2rem 0.5rem',
                          background: activity.tagBg, color: activity.tagColor, border: `1px solid ${activity.tagBorder}`,
                          whiteSpace: 'nowrap', flexShrink: 0,
                        }}>{activity.tag}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#1955e6', fontWeight: 600 }}>
                          {formatTime(activity.time)}
                        </span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#c0bbb5', fontStyle: 'italic' }}>
                          System log · {activity.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}