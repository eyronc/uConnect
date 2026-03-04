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
    if (error) { setError(error.message); setLoading(false); }
    else navigate('/app/dashboard');
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await signInDemo();
    if (error) { setError('Demo account unavailable. Please try again.'); setLoading(false); }
    else navigate('/app/dashboard');
  };

  return (
    <div style={{ height: '100vh', minHeight: '600px', display: 'flex', fontFamily: "'DM Sans', sans-serif", background: '#F7F3EE', overflow: 'hidden' }}>
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
        padding: '3rem 3.5rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        alignSelf: 'stretch',
      }} className="left-panel">
        <style>{`@media(min-width:1024px){ .left-panel{ display:flex !important; } }`}</style>

        {/* Decorative grid lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* TOP: logo + headline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4rem' }}>
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

        {/* BOTTOM: stat cards */}
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
}