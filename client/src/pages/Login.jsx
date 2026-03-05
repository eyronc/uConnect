import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/app/dashboard');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await signInDemo();
    if (error) {
      setError('Demo account unavailable. Please try again.');
      setLoading(false);
    } else {
      navigate('/app/dashboard');
    }
  };

  const BackgroundOrbs = () => (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );

  return (
  <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 relative overflow-hidden font-inter">
    <BackgroundOrbs />

    {/* LEFT PANEL */}
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-16 flex-col justify-between relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/40">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">uConnect</span>
        </div>

        <h1 className="text-6xl font-bold text-white leading-tight mb-6">
          Campus life, <br />
          <span className="text-blue-400">reimagined.</span>
        </h1>

        <p className="text-slate-400 text-xl max-w-md">
          Your academic ecosystem in one intelligent platform.
        </p>
      </div>

      <div className="grid gap-6 relative z-10">
        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center gap-4 shadow-lg">
          <div className="h-12 w-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 font-bold text-lg">
            48K
          </div>
          <div>
            <p className="font-semibold text-white">Active Students</p>
            <p className="text-sm text-slate-400">Thriving daily on uConnect.</p>
          </div>
        </div>

        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center gap-4 shadow-lg">
          <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-lg">
            200+
          </div>
          <div>
            <p className="font-semibold text-white">Campus Services</p>
            <p className="text-sm text-slate-400">All integrated seamlessly.</p>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/40 space-y-8">

        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-slate-500">
            Sign in to continue your journey
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full h-14 pl-12 pr-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-14 pl-12 pr-12 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full h-14 bg-white border border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 transition shadow-sm"
        >
          Try Demo Account
        </button>

        <p className="text-center text-slate-500">
          No account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </div>
  </div>
);
}