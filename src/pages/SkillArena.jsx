import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Code, Zap, Target, Award, TrendingUp, Clock, CircleCheck as CheckCircle2 } from 'lucide-react';

export default function SkillArena() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [challengesRes, leaderboardRes, statsRes] = await Promise.all([
          supabase
            .from('skill_challenges')
            .select('*')
            .eq('status', 'active')
            .limit(6),
          supabase
            .from('leaderboard')
            .select('*, profiles!inner(full_name)')
            .order('total_points', { ascending: false })
            .limit(10),
          supabase
            .from('leaderboard')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
        ]);

        setChallenges(challengesRes.data || []);
        setLeaderboard(leaderboardRes.data || []);
        setUserStats(statsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching skill arena data:', error);
        setLoading(false);
      }
    };

    fetchData();

    const channel = supabase
      .channel('skill_arena_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-500';
      case 'medium':
        return 'bg-orange-500/10 text-orange-500';
      case 'hard':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Layout title="Skill Arena">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-card border border-border rounded-xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Skill Arena">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Skill Arena</h2>
              </div>
              <p className="text-white/90 text-lg mb-6">
                Challenge yourself, compete with peers, and climb the leaderboard
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors backdrop-blur-sm">
                  Start Challenge
                </button>
                <button className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors">
                  View Rules
                </button>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-center gap-4">
              <div className="h-24 w-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              {userStats && (
                <div className="text-center">
                  <p className="text-2xl font-bold">{userStats.total_points}</p>
                  <p className="text-sm text-white/80">Your Points</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {userStats?.challenges_completed || 0}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Zap className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {userStats?.total_points || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  #{userStats?.rank || '-'}
                </p>
                <p className="text-sm text-muted-foreground">Rank</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {userStats?.badges?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Badges</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Available Challenges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                          challenge.difficulty
                        )}`}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {challenge.points} pts
                        </span>
                        {challenge.time_limit_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {challenge.time_limit_minutes}m
                          </span>
                        )}
                      </div>
                      <button className="text-sm font-medium text-primary hover:underline">
                        Start →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-5 w-5 text-warning" />
                <h3 className="text-lg font-semibold text-foreground">Leaderboard</h3>
              </div>

              <div className="space-y-3">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.user_id === user.id;

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                        isCurrentUser
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                          index === 0
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : index === 1
                            ? 'bg-gray-400/20 text-gray-400'
                            : index === 2
                            ? 'bg-orange-500/20 text-orange-500'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {entry.profiles?.full_name || 'Anonymous'}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-primary">(You)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.challenges_completed} challenges
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          {entry.total_points}
                        </p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
