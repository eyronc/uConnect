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
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden font-inter">
      <BackgroundOrbs />

      {/* Left Panel: Promo (Matched to Register Layout) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900/95 via-blue-950/70 to-slate-950 p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">uConnect</span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6 font-inter">
            Campus life, <br />
            <span className="text-blue-400">unified.</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-md font-inter">
            Courses • Schedules • Clubs • Services
          </p>
        </div>

        <div className="grid gap-4 relative z-10">
          <div className="grid gap-4 relative z-10 -mt-20"> 
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="h-10 w-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold">48K</div>
              <div>
                <p className="font-bold text-white">Students</p>
                <p className="text-sm text-slate-400">Active users across campus.</p>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 font-bold">200</div>
              <div>
                <p className="font-bold text-white">Services</p>
                <p className="text-sm text-slate-400">Integrated academic tools.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      {/* Right Panel: Form (Matched to Register Positioning) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">uConnect</h2>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight font-inter">Welcome back</h2>
            <p className="text-slate-500 text-lg font-inter">Sign in to your dashboard</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:outline-none transition-all shadow-sm text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <Link to="#" className="text-xs font-medium text-blue-600 hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:outline-none transition-all shadow-sm text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="keepSignedIn"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="keepSignedIn" className="text-sm text-slate-600 cursor-pointer">
                Keep signed in
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-500">or</span></div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full h-14 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group shadow-sm"
          >
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Try Demo Account
          </button>

          <p className="text-center text-slate-500">
            No account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}