import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { GraduationCap } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ background: '#F7F3EE', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        a { text-decoration: none; color: inherit; }

        .btn-dark {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #1a1510; color: #F7F3EE;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.8rem; letter-spacing: 0.07em; text-transform: uppercase;
          padding: 0.875rem 1.625rem; border: none; cursor: pointer;
          transition: background 0.2s;
        }
        .btn-dark:hover { background: #2e2820; }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: transparent; color: #1a1510;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.8rem; letter-spacing: 0.07em; text-transform: uppercase;
          padding: 0.875rem 1.625rem;
          border: 1.5px solid #c8c2bb; cursor: pointer;
          transition: border-color 0.2s;
        }
        .btn-outline:hover { border-color: #1a1510; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .a1 { animation: fadeUp 0.6s 0.1s both; }
        .a2 { animation: fadeUp 0.6s 0.25s both; }
        .a3 { animation: fadeUp 0.6s 0.4s both; }
        .a4 { animation: fadeUp 0.6s 0.55s both; }
      `}</style>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #ddd8d0',
        padding: '0 1.75rem',
        height: 60,
        display: 'flex',
        alignItems: 'center',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 30, height: 30, background: '#1a1510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={16} color="#F7F3EE" />
          </div>
          <span style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1a1510', letterSpacing: '-0.01em' }}>uConnect</span>
        </Link>
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.75rem' }}>
        <div style={{ maxWidth: 560, width: '100%' }}>

          {/* 404 number */}
          <div className="a1" style={{ marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 2, background: '#1a1510', marginBottom: '1.5rem' }} />
            <span className="f-display" style={{
              fontSize: 'clamp(6rem, 15vw, 10rem)',
              fontWeight: 700,
              color: '#1a1510',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              display: 'block',
            }}>
              404
            </span>
          </div>

          {/* Headline */}
          <div className="a2" style={{ marginBottom: '1rem' }}>
            <h1 className="f-display" style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 700,
              color: '#1a1510',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}>
              Page not found.{' '}
              <em style={{ fontStyle: 'italic', color: '#7aabff' }}>Lost?</em>
            </h1>
          </div>

          {/* Description */}
          <div className="a3" style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.9375rem', color: '#7a756f', lineHeight: 1.7, maxWidth: 400 }}>
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          {/* Buttons */}
          <div className="a4" style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
            <Link to="/app/dashboard" className="btn-dark">
              <Home size={14} /> Go to Dashboard
            </Link>
            <button className="btn-outline" onClick={() => window.history.back()}>
              <ArrowLeft size={14} /> Go Back
            </button>
          </div>

          {/* Divider + footnote */}
          <div className="a4" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #ddd8d0' }}>
            <p style={{ fontSize: '0.78rem', color: '#b0aba5' }}>
              © 2025 uConnect · All rights reserved
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFound;