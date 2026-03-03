import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signUp(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  // Shared Background Component to keep it DRY
  const BackgroundOrbs = () => (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative">
        <BackgroundOrbs />
        <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-3xl p-10 border border-slate-200 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Check your email</h2>
            <p className="text-slate-600">We've sent a verification link to <br/><span className="font-semibold text-slate-900">{email}</span></p>
          </div>
          <Link to="/login" className="flex items-center justify-center w-full h-14 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all">
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden font-inter">
      <BackgroundOrbs />

      {/* Left Panel: Promo (Visible on LG) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">uConnect</span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Everything your campus <br />
            <span className="text-blue-400">needs in one place.</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-md">Join 48k+ students organizing their academic life with precision.</p>
        </div>

        <div className="grid gap-4 relative z-10">
          <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl mt-5 border border-white/10 flex items-center gap-4">
            <div className="h-10 w-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold">01</div>
            <div>
              <p className="font-bold text-white">Unified Dashboard</p>
              <p className="text-sm text-slate-400">Courses, schedules, and grades.</p>
            </div>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 font-bold">02</div>
            <div>
              <p className="font-bold text-white">Skill Arena</p>
              <p className="text-sm text-slate-400">Compete in live coding battles.</p>
            </div>
          </div>
        </div>

        {/* Abstract shape for the dark side */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">uConnect</h2>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-lg">Start your journey with us today.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <span className="text-xs text-slate-400">Min. 6 chars</span>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:outline-none transition-all shadow-sm"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Create Account'}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}