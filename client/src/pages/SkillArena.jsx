import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import CodeArena from '@/components/CodeArena';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Code, Zap, Target, Award, TrendingUp, Clock, ChevronRight, Terminal, Flame } from 'lucide-react';

export default function SkillArena() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCodeArena, setShowCodeArena] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const problems = [
    {
      title: 'Sum Two Numbers', difficulty: 'easy', points: 50,
      description: 'Write a function that takes two numbers and returns their sum.',
      testCases: [{ input: 'sumTwoNumbers(2, 3)', expected: 5 }, { input: 'sumTwoNumbers(5, 7)', expected: 12 }],
      starterCode: `function sumTwoNumbers(a, b) {\n  // your code\n  return 0;\n}`,
      solution: `function sumTwoNumbers(a, b) {\n  return a + b;\n}`
    },
    {
      title: 'Reverse String', difficulty: 'medium', points: 150,
      description: 'Return the input string reversed.',
      testCases: [{ input: "reverse('abc')", expected: 'cba' }, { input: "reverse('hello')", expected: 'olleh' }],
      starterCode: `function reverse(s) {\n  // your code\n  return '';\n}`,
      solution: `function reverse(s) {\n  return s.split('').reverse().join('');\n}`
    },
  ];

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [challengesRes, leaderboardRes, statsRes] = await Promise.all([
          supabase.from('skill_challenges').select('*').eq('status', 'active').limit(6),
          supabase.from('leaderboard').select('*, profiles!inner(full_name)').order('total_points', { ascending: false }).limit(10),
          supabase.from('leaderboard').select('*').eq('user_id', user.id).maybeSingle(),
        ]);
        setChallenges(challengesRes.data || []);
        setLeaderboard(leaderboardRes.data || []);
        setUserStats(statsRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const channel = supabase.channel('skill_arena_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, fetchData)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  const diffConfig = {
    easy:   { color: '#1a7a4a', bg: '#f0faf4', border: '#a8dfc0' },
    medium: { color: '#b07020', bg: '#fffbeb', border: '#f5d87a' },
    hard:   { color: '#c83030', bg: '#fff4f4', border: '#f8c8c8' },
  };

  if (loading) return (
    <Layout title="Skill Arena">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite' }} />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#b0aba5', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Initializing arena…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Layout>
  );

  return (
    <>
      <Layout title="Skill Arena">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
          * { box-sizing: border-box; }
          .f-display { font-family: 'Playfair Display', Georgia, serif; }
          .challenge-card { transition: box-shadow 0.2s, border-color 0.2s; cursor: pointer; }
          .challenge-card:hover { box-shadow: 0 6px 24px rgba(26,21,16,0.1); border-color: #1955e6 !important; }
          .lb-row:hover { background: #f0ebe4 !important; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Hero banner */}
          <div style={{ background: '#1a1510', padding: '2rem 2.25rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 500, color: '#5a5550', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Competitive Coding
              </p>
              <h2 className="f-display" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 0.875rem' }}>
                Skill <em style={{ color: '#7aabff' }}>Arena</em>
              </h2>
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                <button onClick={() => { const p = problems[Math.floor(Math.random() * problems.length)]; setSelectedProblem(p); setShowCodeArena(true); }} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: '#F7F3EE', border: 'none', color: '#1a1510',
                  fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '0.625rem 1.25rem', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e8e2db'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F7F3EE'}>
                  <Flame size={13} /> Enter the Pit <ChevronRight size={11} />
                </button>
                <button style={{
                  background: 'transparent', border: '1.5px solid rgba(255,255,255,0.1)',
                  color: '#6b6560', fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '0.625rem 1.25rem', cursor: 'pointer',
                }}>Global Rules</button>
              </div>
            </div>

            {/* XP badge */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem 2rem', textAlign: 'center' }}>
              <Trophy size={20} color="#7aabff" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
              <div className="f-display" style={{ fontSize: '2rem', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em' }}>
                {userStats?.total_points || 0}
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#5a5550', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>Arena XP</p>
            </div>

            <Terminal size={100} color="rgba(255,255,255,0.03)" style={{ position: 'absolute', right: -16, bottom: -20 }} />
          </div>

          {/* Mini stat bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1px', background: '#ddd8d0' }}>
            {[
              { label: 'Cleared',       val: userStats?.challenges_completed || 0,   icon: Target,    color: '#1955e6' },
              { label: 'Global Rank',   val: `#${userStats?.rank || '–'}`,           icon: TrendingUp, color: '#1a7a4a' },
              { label: 'Achievements',  val: userStats?.badges?.length || 0,          icon: Award,      color: '#8b3de8' },
              { label: 'Current Streak',val: '5 Days',                               icon: Zap,        color: '#b07020' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ background: '#fff', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: 34, height: 34, background: s.color + '12', border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color={s.color} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#a0a09c', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{s.label}</p>
                    <p className="f-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.01em', margin: 0 }}>{s.val}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Two-column: missions + leaderboard */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1px', background: '#ddd8d0', alignItems: 'start' }}>

            {/* Mission board */}
            <div style={{ background: '#fff', padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ width: 28, height: 2, background: '#1955e6', marginBottom: '0.75rem' }} />
                <h3 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', margin: 0 }}>Mission Board</h3>
              </div>

              {challenges.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: '#ddd8d0' }}>
                  {challenges.map(challenge => {
                    const diff = diffConfig[challenge.difficulty?.toLowerCase()] || diffConfig.easy;
                    return (
                      <div key={challenge.id} className="challenge-card" style={{ background: '#faf8f5', border: '1px solid transparent', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                          <div style={{ width: 34, height: 34, background: '#F7F3EE', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Code size={15} color="#1955e6" />
                          </div>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', background: diff.bg, border: `1px solid ${diff.border}`, color: diff.color }}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.9375rem', fontWeight: 600, color: '#1a1510', margin: '0 0 0.375rem', textTransform: 'uppercase', letterSpacing: '0.01em', lineHeight: 1.25 }}>
                          {challenge.title}
                        </h4>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: '#8a857f', lineHeight: 1.55, marginBottom: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {challenge.description}
                        </p>
                        <div style={{ borderTop: '1px solid #e8e2db', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.875rem' }}>
                            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#1955e6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Trophy size={10} /> {challenge.points} XP
                            </span>
                            {challenge.time_limit_minutes && (
                              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#a0a09c', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Clock size={10} /> {challenge.time_limit_minutes}m
                              </span>
                            )}
                          </div>
                          <ChevronRight size={13} color="#c0bbb5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '3rem', textAlign: 'center', background: '#faf8f5', border: '1px dashed #ddd8d0' }}>
                  <Terminal size={28} color="#ddd8d0" style={{ margin: '0 auto 0.875rem' }} />
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#c0bbb5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>No active missions</p>
                </div>
              )}
            </div>

            {/* Leaderboard */}
            <div style={{ background: '#fff', padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ width: 28, height: 2, background: '#b07020', marginBottom: '0.75rem' }} />
                <h3 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Flame size={15} color="#b07020" /> Top Players
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#ddd8d0', marginBottom: '0.875rem' }}>
                {leaderboard.map((entry, index) => {
                  const isMe = entry.user_id === user.id;
                  const rankColors = ['#c87d10', '#6b6460', '#b07020'];
                  return (
                    <div key={entry.id} className="lb-row" style={{
                      background: isMe ? '#eef3ff' : '#faf8f5',
                      padding: '0.75rem 0.875rem',
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      borderLeft: isMe ? '2px solid #1955e6' : '2px solid transparent',
                      transition: 'background 0.15s',
                    }}>
                      <div style={{
                        width: 26, height: 26, flexShrink: 0,
                        background: index < 3 ? rankColors[index] + '18' : '#F7F3EE',
                        border: `1px solid ${index < 3 ? rankColors[index] + '40' : '#e8e2db'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                        fontSize: '0.7rem', color: index < 3 ? rankColors[index] : '#a0a09c',
                      }}>{index + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: isMe ? '#1955e6' : '#1a1510', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.profiles?.full_name?.split(' ')[0] || 'Unknown'}
                          {isMe && <span style={{ fontSize: '0.65rem', color: '#1955e6', marginLeft: '0.375rem', fontStyle: 'italic' }}>you</span>}
                        </p>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.68rem', color: '#a0a09c', margin: '0.1rem 0 0' }}>
                          {entry.challenges_completed} cleared
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span className="f-display" style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1510' }}>{entry.total_points}</span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.6rem', color: '#1955e6', fontWeight: 700, marginLeft: 3 }}>XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button style={{
                width: '100%', height: 36,
                background: 'transparent', border: '1.5px solid #ddd8d0',
                fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 600,
                color: '#8a857f', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1510'; e.currentTarget.style.color = '#1a1510'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd8d0'; e.currentTarget.style.color = '#8a857f'; }}>
                View Full Standings
              </button>
            </div>

          </div>
        </div>
      </Layout>

      {showCodeArena && selectedProblem && (
        <CodeArena onClose={() => setShowCodeArena(false)} problem={selectedProblem} />
      )}
    </>
  );
}