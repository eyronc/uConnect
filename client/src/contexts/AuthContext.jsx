import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) fetchProfile(currentUser.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const signUp = async (email, password) => {
    const result = await supabase.auth.signUp({ email, password });
    return result;
  };

  const signIn = async (email, password) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signInDemo = async () => {
    try {
      return await supabase.auth.signInWithPassword({
        email: 'demo@uconnect.edu',
        password: 'DemoPassword123!'
      });
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    setProfile(null);
    return await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    profile, // Now available to all components
    loading,
    signUp,
    signIn,
    signInDemo,
    signOut,
    refreshProfile, // Allows Settings to trigger an update
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}