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
  <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 relative overflow-hidden font-inter">
    <BackgroundOrbs />

    {/* LEFT PANEL */}
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-16 flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-center gap-3 mb-16">
          <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <span className="text-3xl font-bold text-white">uConnect</span>
        </div>

        <h1 className="text-6xl font-bold text-white leading-tight mb-6">
          Join the future <br />
          <span className="text-blue-400">of campus life.</span>
        </h1>

        <p className="text-slate-400 text-xl max-w-md">
          Powerful tools. Smarter learning. Connected students.
        </p>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/40 space-y-8">

        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500">Start your journey today.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full h-14 pl-12 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full h-14 pl-12 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-14 pl-12 pr-12 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-2xl shadow-xl transition-all disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  </div>
);
}