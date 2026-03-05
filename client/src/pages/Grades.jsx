import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, BookOpen, TrendingUp, Clock, Inbox, ChevronRight } from 'lucide-react';

export default function Grades() {
  const { user, profile } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGrades = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('grades').select('*, courses(*)').eq('user_id', user.id).order('graded_at', { ascending: false });
      if (error) throw error;
      setGrades(data || []);
    } catch (err) {
      console.error('Error fetching grades:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchGrades();
    const channel = supabase.channel('realtime_grades')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grades', filter: `user_id=eq.${user.id}` }, fetchGrades)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user, fetchGrades]);

  const graded   = grades.filter(g => g.score !== null);
  const pending  = grades.filter(g => g.score === null);
  const avgPct   = graded.length > 0
    ? (graded.reduce((s, g) => s + (g.percentage || 0), 0) / graded.length).toFixed(1)
    : null;

  const getGrade = (pct) => {
    if (pct >= 95) return { label: '1.0', color: '#1a7a4a' };
    if (pct >= 90) return { label: '1.25', color: '#1a7a4a' };
    if (pct >= 85) return { label: '1.5', color: '#1955e6' };
    if (pct >= 80) return { label: '1.75', color: '#1955e6' };
    if (pct >= 75) return { label: '2.0', color: '#b07020' };
    return { label: 'INC', color: '#c83030' };
  };

  if (loading) return (
    <Layout title="Grades">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#b0aba5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Syncing grades…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout title="Grades">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .grade-row:hover { background: #f0ebe4 !important; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: '2rem' }}>

        {/* Header banner */}
        <div style={{ background: '#1a1510', padding: '2rem 2.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 500, color: '#5a5550', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Academic Performance
            </p>
            <h2 className="f-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              Your grades &amp; assessments
            </h2>
          </div>
          {/* GPA badge */}
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', textAlign: 'center' }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#6a9fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
              Current GPA
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} color="#34b87a" />
              <span className="f-display" style={{ fontSize: '2rem', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em' }}>
                {profile?.gpa?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1px', background: '#ddd8d0', alignItems: 'start' }}>

          {/* Main grades list */}
          <div style={{ background: '#fff', padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ width: 28, height: 2, background: '#1955e6', marginBottom: '0.75rem' }} />
              <h3 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.015em', margin: 0 }}>
                Recent Assessments
              </h3>
            </div>

            {grades.length === 0 ? (
              <div style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, background: '#F7F3EE', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Inbox size={20} color="#c0bbb5" />
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', color: '#a0a09c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  No grades posted yet
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e2db' }}>
                {grades.map(g => {
                  const equiv = g.percentage ? getGrade(g.percentage) : null;
                  return (
                    <div key={g.id} className="grade-row" style={{
                      background: '#faf8f5', padding: '1rem 1.125rem',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      transition: 'background 0.15s',
                    }}>
                      <div style={{ width: 36, height: 36, flexShrink: 0, background: '#F7F3EE', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={15} color="#1955e6" />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1a1510', margin: '0 0 0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {g.courses?.course_name || 'Course Name'}
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#8a857f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {g.assessment_name}
                          </span>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#c0bbb5', fontStyle: 'italic' }}>
                            {new Date(g.graded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {g.score !== null ? (
                          <>
                            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.02em', margin: 0 }}>
                              {g.score}<span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', color: '#c0bbb5', fontWeight: 400 }}>/{g.max_score}</span>
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.375rem', marginTop: '0.2rem' }}>
                              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 700, color: '#8a857f' }}>
                                {g.percentage?.toFixed(1)}%
                              </span>
                              {equiv && (
                                <span style={{
                                  fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700,
                                  color: equiv.color, padding: '0.1rem 0.4rem',
                                  border: `1px solid ${equiv.color}44`,
                                  background: equiv.color + '11',
                                }}>
                                  {equiv.label}
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <span style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            padding: '0.2rem 0.5rem', background: '#fffbeb', border: '1px solid #f5d87a', color: '#b07020',
                          }}>Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar summary */}
          <div style={{ background: '#fff', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ width: 28, height: 2, background: '#1955e6', marginBottom: '0.75rem' }} />
              <h3 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.015em', margin: 0 }}>
                Summary
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e2db' }}>
              {[
                { icon: Clock, label: 'In Progress', value: `${pending.length} subjects`, color: '#b07020', bg: '#fffbeb', border: '#f5d87a' },
                { icon: Trophy, label: 'Completed', value: `${graded.length} exams`, color: '#1a7a4a', bg: '#f0faf4', border: '#a8dfc0' },
                ...(avgPct ? [{ icon: TrendingUp, label: 'Avg Score', value: `${avgPct}%`, color: '#1955e6', bg: '#eef3ff', border: '#c5d3ff' }] : []),
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ background: '#faf8f5', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: 28, height: 28, background: item.bg, border: `1px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={13} color={item.color} />
                      </div>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 500, color: '#6b6460', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {item.label}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.9375rem', fontWeight: 700, color: '#1a1510' }}>
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>

            <button style={{
              width: '100%', height: 40,
              background: '#1a1510', border: 'none', color: '#F7F3EE',
              fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#2e2820'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a1510'}>
              Request Review <ChevronRight size={12} />
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}