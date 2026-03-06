import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Clock } from 'lucide-react';

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

  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .f-display { font-family: 'Playfair Display', Georgia, serif; }
    a { text-decoration: none; color: inherit; }

    .reg-left {
      position: relative; width: 52%; min-height: 100vh;
      overflow: hidden; display: flex; flex-direction: column;
    }
    .reg-vid-bg { position: absolute; inset: 0; z-index: 0; }
    .reg-vid-bg video { width: 100%; height: 100%; object-fit: cover; object-position: center 40%; }
    .reg-overlay {
      position: absolute; inset: 0; z-index: 1;
      background: linear-gradient(160deg, rgba(12,9,5,0.82) 0%, rgba(12,9,5,0.58) 50%, rgba(12,9,5,0.88) 100%);
    }
    .reg-grain {
      position: absolute; inset: 0; z-index: 2;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
      opacity: 0.5; pointer-events: none;
    }
    .reg-vignette {
      position: absolute; inset: 0; z-index: 3;
      box-shadow: inset 0 0 140px rgba(0,0,0,0.45); pointer-events: none;
    }
    .reg-left-content {
      position: relative; z-index: 10;
      display: flex; flex-direction: column;
      height: 100%; padding: 2.5rem; justify-content: space-between;
    }
    .reg-right {
      width: 48%; display: flex; flex-direction: column;
      justify-content: center; padding: 3rem 4rem;
      background: #F7F3EE; overflow-y: auto;
    }
    .field-wrap { position: relative; margin-bottom: 1rem; }
    .field-icon {
      position: absolute; left: 1rem; top: 50%;
      transform: translateY(-50%); color: #a09a93;
      pointer-events: none; transition: color 0.2s;
    }
    .field-input {
      width: 100%; height: 52px; padding: 0 1rem 0 2.75rem;
      background: #fff; border: 1px solid #ddd8d0;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: #1a1510;
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .field-input::placeholder { color: #b0aba5; }
    .field-input:focus { border-color: #1a1510; box-shadow: 0 0 0 3px rgba(26,21,16,0.06); }
    .btn-dark-full {
      width: 100%; height: 52px; background: #1a1510; color: #F7F3EE;
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.8rem;
      letter-spacing: 0.07em; text-transform: uppercase;
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: background 0.2s;
    }
    .btn-dark-full:hover { background: #2e2820; }
    .btn-dark-full:disabled { opacity: 0.6; cursor: not-allowed; }
    .error-box {
      padding: 0.875rem 1rem; background: #fff5f5;
      border: 1px solid #f5c6c6; color: #c0392b;
      font-size: 0.8375rem; margin-bottom: 1.25rem;
    }
    .perks-cell {
      padding: 1.125rem 1.25rem; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(12px); margin-bottom: 0.625rem;
      display: flex; align-items: flex-start; gap: 0.875rem;
    }
    .perk-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #7aabff; flex-shrink: 0; margin-top: 0.4rem;
    }
    /* Success */
    .success-page { background: #F7F3EE; min-height: 100vh; display: flex; flex-direction: column; font-family: 'DM Sans', sans-serif; }
    .success-nav { border-bottom: 1px solid #ddd8d0; padding: 0 1.75rem; height: 60px; display: flex; align-items: center; }
    .success-body { flex: 1; display: flex; align-items: center; justify-content: center; padding: 4rem 1.75rem; }
    .expiry-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: #fff8e6; border: 1px solid #f0d98a; color: #8a6d00;
      padding: 0.4rem 0.875rem; font-size: 0.72rem; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2rem;
    }
    .step-row {
      display: flex; align-items: flex-start; gap: 1rem;
      padding: 1rem 0; border-bottom: 1px solid #ede8e2;
    }
    .step-num-sm {
      font-family: 'Playfair Display', serif; font-size: 1.25rem;
      font-weight: 700; color: #c8c2bb; line-height: 1; flex-shrink: 0; width: 28px;
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(18px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .a1 { animation: fadeUp 0.6s 0.1s both; }
    .a2 { animation: fadeUp 0.6s 0.2s both; }
    .a3 { animation: fadeUp 0.6s 0.3s both; }
    .a4 { animation: fadeUp 0.6s 0.4s both; }
    .a5 { animation: fadeUp 0.6s 0.5s both; }
    .a6 { animation: fadeUp 0.6s 0.6s both; }
    @media(max-width: 820px) {
      .reg-left { display: none; }
      .reg-right { width: 100%; padding: 2rem 1.5rem; }
    }
  `;

  // ── Success state ──
  if (success) {
    return (
      <div>
        <style>{sharedStyles}</style>
        <div className="success-page">
          <nav className="success-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 30, height: 30, background: '#1a1510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={16} color="#F7F3EE" />
              </div>
              <span style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1a1510', letterSpacing: '-0.01em' }}>uConnect</span>
            </div>
          </nav>

          <div className="success-body">
            <div style={{ maxWidth: 480, width: '100%' }}>

              <div className="a1">
                <div className="expiry-badge"><Clock size={12} /> Link expires in 15 minutes</div>
              </div>

              <div className="a2" style={{ marginBottom: '2rem' }}>
                <div style={{ width: 36, height: 2, background: '#1a1510', marginBottom: '1.25rem' }} />
                <h1 className="f-display" style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: '#1a1510',
                  letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '0.625rem',
                }}>
                  Check your inbox.
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#7a756f', lineHeight: 1.7 }}>
                  We sent a confirmation link to{' '}
                  <strong style={{ color: '#1a1510' }}>{email}</strong>
                </p>
              </div>

              <div className="a3" style={{ marginBottom: '2.5rem' }}>
                {[
                  { n: '01', text: 'Open the email from Supabase Auth in your inbox' },
                  { n: '02', text: 'Click "Confirm your mail" before the link expires' },
                  { n: '03', text: "You'll be redirected back to sign in" },
                ].map((s) => (
                  <div key={s.n} className="step-row">
                    <span className="step-num-sm">{s.n}</span>
                    <span style={{ fontSize: '0.875rem', color: '#4a4540', lineHeight: 1.6 }}>{s.text}</span>
                  </div>
                ))}
              </div>

              <div className="a4">
                <Link to="/login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  height: 52, background: '#1a1510', color: '#F7F3EE',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  fontSize: '0.8rem', letterSpacing: '0.07em', textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                }}>
                  Return to sign in <ArrowRight size={14} />
                </Link>
              </div>

              <div className="a4" style={{ paddingTop: '1.5rem', borderTop: '1px solid #ddd8d0' }}>
                <p style={{ fontSize: '0.78rem', color: '#b0aba5' }}>
                  Didn't receive it? Check your spam folder or{' '}
                  <Link to="/register" style={{ color: '#1a1510', borderBottom: '1px solid #c8c2bb' }}>try again</Link>.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Register form ──
  return (
    <div style={{ background: '#F7F3EE', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', display: 'flex' }}>
      <style>{sharedStyles}</style>

      <div className="reg-left">
        <div className="reg-vid-bg">
          <video autoPlay muted loop playsInline preload="auto">
            <source src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            <source src="https://videos.pexels.com/video-files/5198239/5198239-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="reg-overlay" />
        <div className="reg-grain" />
        <div className="reg-vignette" />

        <div className="reg-left-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 30, height: 30, background: '#F7F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={16} color="#1a1510" />
            </div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#F7F3EE', letterSpacing: '-0.01em' }}>uConnect</span>
          </div>

          <div>
            <div style={{ width: 36, height: 2, background: '#7aabff', marginBottom: '1.5rem' }} />
            <h2 className="f-display" style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: '#F7F3EE',
              lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: '1rem',
            }}>
              Join the future<br />
              <em style={{ fontStyle: 'italic', color: '#7aabff' }}>of campus life.</em>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(247,243,238,0.5)', lineHeight: 1.7, maxWidth: 320 }}>
              Powerful tools. Smarter learning. Connected students.
            </p>
          </div>

          <div>
            {[
              { title: 'Unified Dashboard', body: 'All your academic info in one clean interface' },
              { title: 'Skill Arena', body: 'Compete in coding challenges and climb leaderboards' },
              { title: 'Smart Advising', body: 'AI-powered guidance and advisor connections' },
            ].map((p, i) => (
              <div key={i} className="perks-cell">
                <div className="perk-dot" />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F7F3EE', marginBottom: '0.2rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(247,243,238,0.45)', lineHeight: 1.5 }}>{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reg-right">
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>

          <div className="a1" style={{ marginBottom: '2.5rem' }}>
            <div style={{ width: 36, height: 2, background: '#1a1510', marginBottom: '1.25rem' }} />
            <h1 className="f-display" style={{
              fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)', fontWeight: 700, color: '#1a1510',
              letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '0.5rem',
            }}>
              Create account
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#7a756f' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1a1510', fontWeight: 600, borderBottom: '1px solid #1a1510' }}>Sign in</Link>
            </p>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="a2">
            <div className="field-wrap">
              <span className="field-icon"><User size={16} /></span>
              <input className="field-input" type="text" value={fullName}
                onChange={(e) => setFullName(e.target.value)} placeholder="Full name" required />
            </div>
          </div>

          <div className="a3">
            <div className="field-wrap">
              <span className="field-icon"><Mail size={16} /></span>
              <input className="field-input" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required />
            </div>
          </div>

          <div className="a4">
            <div className="field-wrap" style={{ position: 'relative' }}>
              <span className="field-icon"><Lock size={16} /></span>
              <input className="field-input" type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ paddingRight: '3rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a09a93' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="a5" style={{ marginTop: '1.5rem' }}>
            <button className="btn-dark-full" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating account…' : <>Create account <ArrowRight size={14} /></>}
            </button>
          </div>

          <div className="a6" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd8d0' }}>
            <p style={{ fontSize: '0.78rem', color: '#b0aba5', textAlign: 'center', marginBottom: '0.5rem' }}>
              No credit card required · Free forever for students
            </p>
            <p style={{ fontSize: '0.78rem', color: '#b0aba5', textAlign: 'center' }}>© 2025 uConnect · All rights reserved</p>
          </div>

        </div>
      </div>
    </div>
  );
}