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

  return (
    <div style={{ background: '#F7F3EE', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        a { text-decoration: none; color: inherit; }

        .login-left {
          position: relative;
          width: 52%;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .login-vid-bg {
          position: absolute; inset: 0; z-index: 0;
        }
        .login-vid-bg video {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 30%;
        }
        .login-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            160deg,
            rgba(12,9,5,0.82) 0%,
            rgba(12,9,5,0.58) 50%,
            rgba(12,9,5,0.88) 100%
          );
        }
        .login-grain {
          position: absolute; inset: 0; z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          opacity: 0.5;
          pointer-events: none;
        }
        .login-vignette {
          position: absolute; inset: 0; z-index: 3;
          box-shadow: inset 0 0 140px rgba(0,0,0,0.45);
          pointer-events: none;
        }
        .login-left-content {
          position: relative; z-index: 10;
          display: flex; flex-direction: column;
          height: 100%; padding: 2.5rem;
          justify-content: space-between;
        }

        .login-right {
          width: 48%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem 4rem;
          background: #F7F3EE;
        }

        /* Input styles */
        .field-wrap {
          position: relative;
          margin-bottom: 1rem;
        }
        .field-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a09a93;
          pointer-events: none;
          transition: color 0.2s;
        }
        .field-input {
          width: 100%;
          height: 52px;
          padding: 0 1rem 0 2.75rem;
          background: #fff;
          border: 1px solid #ddd8d0;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #1a1510;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #b0aba5; }
        .field-input:focus {
          border-color: #1a1510;
          box-shadow: 0 0 0 3px rgba(26,21,16,0.06);
        }
        .field-input:focus + .field-icon-label { color: #1a1510; }

        /* Buttons */
        .btn-dark-full {
          width: 100%;
          height: 52px;
          background: #1a1510;
          color: #F7F3EE;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background 0.2s;
          margin-bottom: 0.75rem;
        }
        .btn-dark-full:hover { background: #2e2820; }
        .btn-dark-full:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-outline-full {
          width: 100%;
          height: 52px;
          background: transparent;
          color: #1a1510;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          border: 1.5px solid #c8c2bb;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: border-color 0.2s;
        }
        .btn-outline-full:hover { border-color: #1a1510; }
        .btn-outline-full:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Glass stat cards */
        .glass-card {
          padding: 1.25rem 1.5rem;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        /* Error */
        .error-box {
          padding: 0.875rem 1rem;
          background: #fff5f5;
          border: 1px solid #f5c6c6;
          color: #c0392b;
          font-size: 0.8375rem;
          margin-bottom: 1.25rem;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.25rem 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: #ddd8d0;
        }
        .divider-text {
          font-size: 0.72rem;
          color: #b0aba5;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Animations */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .a1 { animation: fadeUp 0.6s 0.1s both; }
        .a2 { animation: fadeUp 0.6s 0.2s both; }
        .a3 { animation: fadeUp 0.6s 0.3s both; }
        .a4 { animation: fadeUp 0.6s 0.4s both; }
        .a5 { animation: fadeUp 0.6s 0.5s both; }

        /* Responsive */
        @media(max-width: 820px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 2rem 1.5rem; }
        }
      `}</style>

      {/* LEFT — video panel */}
      <div className="login-left">
        <div className="login-vid-bg">
          <video autoPlay muted loop playsInline preload="auto">
            <source src="https://videos.pexels.com/video-files/5198239/5198239-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="login-overlay" />
        <div className="login-grain" />
        <div className="login-vignette" />

        <div className="login-left-content">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 30, height: 30, background: '#F7F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={16} color="#1a1510" />
            </div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#F7F3EE', letterSpacing: '-0.01em' }}>uConnect</span>
          </div>

          {/* Headline */}
          <div>
            <div style={{ width: 36, height: 2, background: '#7aabff', marginBottom: '1.5rem' }} />
            <h2 className="f-display" style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 700,
              color: '#F7F3EE',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
            }}>
              Welcome back<br />
              <em style={{ fontStyle: 'italic', color: '#7aabff' }}>to your campus.</em>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(247,243,238,0.5)', lineHeight: 1.7, maxWidth: 320 }}>
              Courses, schedules, clubs — everything you need, all in one place.
            </p>
          </div>

          {/* Stats */}
          <div>
            {[
              { val: '10K+', label: 'Students active', sub: 'Across 40+ universities' },
              { val: '98%',  label: 'User satisfaction', sub: 'Based on end-of-term surveys' },
            ].map((s, i) => (
              <div key={i} className="glass-card">
                <div>
                  <div className="f-display" style={{ fontSize: '1.625rem', fontWeight: 700, color: '#F7F3EE', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(247,243,238,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.25rem' }}>{s.label}</div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(247,243,238,0.27)', lineHeight: 1.5, marginLeft: 'auto', textAlign: 'right', maxWidth: 100 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="login-right">
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>

          {/* Header */}
          <div className="a1" style={{ marginBottom: '2.5rem' }}>
            <div style={{ width: 36, height: 2, background: '#1a1510', marginBottom: '1.25rem' }} />
            <h1 className="f-display" style={{
              fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)',
              fontWeight: 700,
              color: '#1a1510',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}>
              Sign in
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#7a756f' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1a1510', fontWeight: 600, borderBottom: '1px solid #1a1510' }}>
                Create one
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && <div className="error-box">{error}</div>}

          {/* Form */}
          <div className="a2">
            <div className="field-wrap">
              <span className="field-icon"><Mail size={16} /></span>
              <input
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
              />
            </div>
          </div>

          <div className="a3">
            <div className="field-wrap" style={{ position: 'relative' }}>
              <span className="field-icon"><Lock size={16} /></span>
              <input
                className="field-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a09a93' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="a4" style={{ marginTop: '1.5rem' }}>
            <button className="btn-dark-full" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Signing in…' : <>Sign in <ArrowRight size={14} /></>}
            </button>
          </div>

          <div className="a4">
            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>
          </div>

          <div className="a5">
            <button className="btn-outline-full" onClick={handleDemoLogin} disabled={loading}>
              Try demo account
            </button>
          </div>

          <div className="a5" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd8d0' }}>
            <p style={{ fontSize: '0.78rem', color: '#b0aba5', textAlign: 'center' }}>
              © 2025 uConnect · All rights reserved
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}