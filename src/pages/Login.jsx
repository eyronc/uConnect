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
<<<<<<< HEAD
    if (error) { setError(error.message); setLoading(false); }
    else navigate('/app/dashboard');
=======
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/app/dashboard');
    }
>>>>>>> b714cb5f5cde64c99ecefc487ab784650b4ad57c
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await signInDemo();
<<<<<<< HEAD
    if (error) { setError('Demo account unavailable. Please try again.'); setLoading(false); }
    else navigate('/app/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif", background: '#F7F3EE' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }

        .field-input {
          width: 100%; height: 52px;
          padding: 0 1rem 0 3rem;
          background: #fff;
          border: 1.5px solid #ddd8d0;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; color: #1a1510;
          outline: none; transition: border-color 0.2s;
          -webkit-appearance: none;
        }
        .field-input:focus { border-color: #1955e6; }
        .field-input::placeholder { color: #b8b3ac; }

        .btn-submit {
          width: 100%; height: 52px;
          background: #1a1510; color: #F7F3EE;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.85rem; letter-spacing: 0.06em; text-transform: uppercase;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: background 0.2s;
        }
        .btn-submit:hover:not(:disabled) { background: #2e2820; }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-demo {
          width: 100%; height: 52px;
          background: #fff; color: #1a1510;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          font-size: 0.875rem;
          border: 1.5px solid #ddd8d0; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.625rem;
          transition: border-color 0.2s;
        }
        .btn-demo:hover:not(:disabled) { border-color: #1a1510; }
        .btn-demo:disabled { opacity: 0.55; cursor: not-allowed; }

        .link-blue { color: #1955e6; font-weight: 600; }
        .link-blue:hover { text-decoration: underline; }
        .link-small { color: #1955e6; font-size: 0.8rem; font-weight: 500; }
        .link-small:hover { text-decoration: underline; }

        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeUp 0.5s ease both; }
      `}</style>

      {/* Left — dark promo panel */}
      <div style={{
        display: 'none',
        width: '44%',
        background: '#1a1510',
        padding: '3.5rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }} className="left-panel">
        <style>{`@media(min-width:1024px){ .left-panel{ display:flex !important; } }`}</style>

        {/* Decorative grid lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3.5rem' }}>
            <div style={{ width: 28, height: 28, background: '#F7F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={15} color="#1a1510" />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#F7F3EE', letterSpacing: '-0.01em' }}>uConnect</span>
          </div>

          <h2 className="f-display" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 700, color: '#F7F3EE', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
            Campus life,{' '}
            <em style={{ color: '#6a9fff', fontStyle: 'italic' }}>unified.</em>
          </h2>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#5a5550', lineHeight: 1.6 }}>
            Courses · Schedules · Clubs · Services
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1px', background: '#2e2820' }}>
          {[
            { badge: '48K', badgeColor: '#3a7fff', label: 'Students', sub: 'Active users across campus' },
            { badge: '200', badgeColor: '#34b87a', label: 'Services', sub: 'Integrated academic tools' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#221d17', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 42, height: 42, flexShrink: 0,
                background: item.badgeColor + '22',
                border: `1px solid ${item.badgeColor}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: '0.78rem', color: item.badgeColor, letterSpacing: '0.02em',
              }}>{item.badge}</div>
              <div>
                <div style={{ fontWeight: 600, color: '#F7F3EE', fontSize: '0.9rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#5a5550', marginTop: '0.15rem' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
        <div className="fade-in" style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', justifyContent: 'center' }}
               className="mobile-logo">
            <style>{`@media(min-width:1024px){ .mobile-logo{ display:none !important; } }`}</style>
            <div style={{ width: 28, height: 28, background: '#1a1510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={15} color="#F7F3EE" />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1510' }}>uConnect</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 className="f-display" style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#8a857f' }}>Sign in to your dashboard</p>
          </div>

          {error && (
            <div style={{
              padding: '0.875rem 1rem', background: '#fff4f4',
              border: '1px solid #f8c8c8', marginBottom: '1.25rem',
              fontSize: '0.8375rem', color: '#c83030',
              display: 'flex', alignItems: 'center', gap: '0.625rem',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c83030', flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4a4540', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#a8a39c" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@university.edu" className="field-input" required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a4540', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <Link to="#" className="link-small">Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#a8a39c" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="field-input" style={{ paddingRight: '3rem' }} required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#a8a39c', padding: 0,
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Keep signed in */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
              <input
                type="checkbox" checked={keepSignedIn}
                onChange={e => setKeepSignedIn(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: '#1955e6', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.8375rem', color: '#6b6460' }}>Keep me signed in</span>
            </label>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Signing in…' : (<>Sign In <ArrowRight size={14} /></>)}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: '#ddd8d0' }} />
            <span style={{ fontSize: '0.75rem', color: '#b0aba5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#ddd8d0' }} />
          </div>

          <button onClick={handleDemoLogin} className="btn-demo" disabled={loading}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e8a030', flexShrink: 0 }} />
            Try Demo Account
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#8a857f', marginTop: '1.75rem' }}>
            No account? <Link to="/register" className="link-blue">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
=======
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
>>>>>>> b714cb5f5cde64c99ecefc487ab784650b4ad57c
}