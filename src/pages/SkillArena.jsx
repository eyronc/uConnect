import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import CodeArena from '@/components/CodeArena';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Trophy, Code, Zap, Target, Award, 
  TrendingUp, Clock, ChevronRight, 
  Sparkles, Terminal, Flame
} from 'lucide-react';

export default function SkillArena() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCodeArena, setShowCodeArena] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // static list of problems for demo
  const problems = [
    {
      title: 'Sum Two Numbers',
      difficulty: 'easy',
      points: 50,
      description: 'Write a function that takes two numbers and returns their sum.',
      testCases: [
        { input: 'sumTwoNumbers(2, 3)', expected: 5 },
        { input: 'sumTwoNumbers(5, 7)', expected: 12 },
      ],
      starterCode: `function sumTwoNumbers(a, b) {\n  // your code\n  return 0;\n}`,
      solution: `function sumTwoNumbers(a, b) {\n  return a + b;\n}`
    },
    {
      title: 'Reverse String',
      difficulty: 'medium',
      points: 150,
      description: 'Return the input string reversed.',
      testCases: [
        { input: "reverse('abc')", expected: 'cba' },
        { input: "reverse('hello')", expected: 'olleh' },
      ],
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
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();

    const channel = supabase.channel('skill_arena_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const getDiffStyle = (diff) => {
    const d = diff?.toLowerCase();
    if (d === 'easy') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (d === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  if (loading) {
    return (
      <Layout title="Skill Arena">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Terminal className="h-12 w-12 text-indigo-500 animate-pulse" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Initializing Arena...</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout title="Skill Arena">
        <div className="max-w-7xl mx-auto space-y-10 pb-20 font-['Inter']">
          
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-1 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            <div className="relative z-10 bg-slate-900/90 rounded-[2.3rem] p-10 border border-white/5 backdrop-blur-3xl flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h2 className="text-5xl font-black text-white tracking-tighter mb-4">
                  SKILL <span className="text-indigo-500">ARENA</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                  Conquer coding challenges, earn points, and solidify your status as a top-tier developer in the community.
                </p>
                <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                  <button 
                    onClick={() => {
                      const p = problems[Math.floor(Math.random() * problems.length)];
                      setSelectedProblem(p);
                      setShowCodeArena(true);
                    }}
                    className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-3"
                  >
                    <Flame className="h-4 w-4 fill-current" />
                    Enter the Pit
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                    Global Rules
                  </button>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="bg-slate-950/50 border border-white/5 p-8 rounded-[2rem] text-center min-w-[160px] backdrop-blur-md">
                   <Trophy className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
                   <p className="text-3xl font-black text-white font-mono">{userStats?.total_points || 0}</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Arena XP</p>
                </div>
              </div>
            </div>
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>

          {/* Mini Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Cleared', val: userStats?.challenges_completed || 0, icon: Target, col: 'text-blue-400' },
              { label: 'Global Rank', val: `#${userStats?.rank || '-'}`, icon: TrendingUp, col: 'text-emerald-400' },
              { label: 'Achievements', val: userStats?.badges?.length || 0, icon: Award, col: 'text-purple-400' },
              { label: 'Current Streak', val: '5 Days', icon: Zap, col: 'text-orange-400' }
            ].map((s, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl flex items-center gap-4 group hover:bg-slate-800/50 transition-colors">
                <div className={`p-3 rounded-xl bg-white/5 ${s.col}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                  <p className="text-xl font-black text-white mt-0.5">{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Challenges List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <div className="h-6 w-1 bg-indigo-500 rounded-full" />
                  Mission Board
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.length > 0 ? challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="group bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:bg-slate-900 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <Code className="h-6 w-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getDiffStyle(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-white mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 text-indigo-400">
                          <Trophy className="h-3.5 w-3.5" />
                          {challenge.points} XP
                        </span>
                        {challenge.time_limit_minutes && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {challenge.time_limit_minutes}m
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        DEPLOY →
                      </span>
                    </div>
                  </div>
                )) : (
                   <div className="col-span-2 py-20 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl text-center">
                      <Terminal className="h-10 w-10 text-slate-700 mx-auto mb-4" />
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No Active Missions</p>
                   </div>
                )}
              </div>
            </div>

            {/* Leaderboard Sidebar */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-white flex items-center gap-3 px-2">
                  <Flame className="h-5 w-5 text-orange-500" /> Top Gladiators
                </h3>

               <div className="bg-slate-950/50 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-md">
                  <div className="space-y-2">
                    {leaderboard.map((entry, index) => {
                      const isCurrentUser = entry.user_id === user.id;
                      const isTop3 = index < 3;

                      return (
                        <div
                          key={entry.id}
                          className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                            isCurrentUser ? 'bg-indigo-600/20 border border-indigo-500/30 shadow-lg' : 'hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm
                            ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-900 shadow-lg shadow-yellow-500/20' : 
                              index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900' :
                              index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-slate-900' :
                              'bg-slate-900 text-slate-500 border border-white/5'}`}
                          >
                            {index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate uppercase tracking-tight">
                              {entry.profiles?.full_name?.split(' ')[0] || 'Unknown'}
                              {isCurrentUser && <span className="ml-2 text-[10px] text-indigo-400 font-black italic">YOU</span>}
                            </p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                              {entry.challenges_completed} Missions Cleared
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-black text-white font-mono">{entry.total_points}</p>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">XP</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-all">
                    View Full Standings
                  </button>
               </div>
            </div>
          </div>
        </div>
      </Layout>

      {showCodeArena && selectedProblem && (
        <CodeArena
          onClose={() => setShowCodeArena(false)}
          problem={selectedProblem}
        />
      )}
    </>
  );
}