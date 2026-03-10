import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Trophy, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: GraduationCap, title: 'Unified Dashboard',  description: 'All your academic information in one clean interface' },
    { icon: BookOpen,      title: 'Academic Tracking',  description: 'Real-time grades, courses, and progress monitoring' },
    { icon: Users,         title: 'Smart Advising',     description: 'AI-powered guidance and advisor connections' },
    { icon: Trophy,        title: 'Skill Arena',        description: 'Compete in coding challenges and climb leaderboards' },
  ];

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#F7F3EE', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        a { text-decoration: none; color: inherit; }

        .vid-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .vid-bg { position: absolute; inset: 0; z-index: 0; }
        .vid-bg video {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 35%;
        }

        .vid-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            160deg,
            rgba(12,9,5,0.78) 0%,
            rgba(12,9,5,0.55) 50%,
            rgba(12,9,5,0.85) 100%
          );
        }

        .vid-grain {
          position: absolute; inset: 0; z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          opacity: 0.5;
          pointer-events: none;
        }

        .vid-vignette {
          position: absolute; inset: 0; z-index: 3;
          box-shadow: inset 0 0 140px rgba(0,0,0,0.45);
          pointer-events: none;
        }

        .hero-nav {
          position: relative; z-index: 10;
          border-bottom: 1px solid rgba(255,255,255,0.09);
          background: rgba(10,8,5,0.35);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .nav-light { font-family:'DM Sans',sans-serif; font-size:.8375rem; font-weight:500; color:rgba(247,243,238,.7); letter-spacing:.01em; transition:color .2s; }
        .nav-light:hover { color:#fff; }
        .nav-dark  { font-family:'DM Sans',sans-serif; font-size:.8375rem; font-weight:500; color:#4a4540; letter-spacing:.01em; transition:color .2s; }
        .nav-dark:hover  { color:#1955e6; }

        .btn-cream {
          display:inline-flex; align-items:center; gap:.5rem;
          background:#F7F3EE; color:#1a1510;
          font-family:'DM Sans',sans-serif; font-weight:600;
          font-size:.8rem; letter-spacing:.06em; text-transform:uppercase;
          padding:.75rem 1.625rem; transition:background .2s;
        }
        .btn-cream:hover { background:#ede8e2; }

        .btn-ghost-light {
          display:inline-flex; align-items:center; gap:.5rem;
          background:transparent; color:rgba(247,243,238,.8);
          font-family:'DM Sans',sans-serif; font-weight:600;
          font-size:.8rem; letter-spacing:.06em; text-transform:uppercase;
          padding:.75rem 1.625rem;
          border:1.5px solid rgba(247,243,238,.28); cursor:pointer;
          transition:border-color .2s, color .2s;
        }
        .btn-ghost-light:hover { border-color:rgba(247,243,238,.75); color:#fff; }

        .btn-dark {
          display:inline-flex; align-items:center; gap:.5rem;
          background:#1a1510; color:#F7F3EE;
          font-family:'DM Sans',sans-serif; font-weight:600;
          font-size:.8rem; letter-spacing:.06em; text-transform:uppercase;
          padding:.75rem 1.625rem; transition:background .2s;
        }
        .btn-dark:hover { background:#2e2820; }

        .glass-stats {
          display:flex; flex-direction:column; gap:1px;
          background:rgba(255,255,255,.07);
          border:1px solid rgba(255,255,255,.11);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
        }
        .glass-stat {
          padding:1.25rem 1.5rem;
          display:flex; justify-content:space-between; align-items:center;
          background:rgba(255,255,255,.04);
          border-bottom:1px solid rgba(255,255,255,.06);
          transition:background .2s;
        }
        .glass-stat:last-child { border-bottom:none; }
        .glass-stat:hover { background:rgba(255,255,255,.09); }

        .scroll-hint {
          position:absolute; bottom:2rem; left:50%;
          transform:translateX(-50%); z-index:5;
          display:flex; flex-direction:column; align-items:center; gap:.4rem;
          opacity:.45; animation:bounceY 2.2s ease-in-out infinite;
        }
        .scroll-hint span {
          font-family:'DM Sans',sans-serif; font-size:.65rem;
          font-weight:500; color:#fff; letter-spacing:.14em; text-transform:uppercase;
        }
        .scroll-line { width:1px; height:36px; background:linear-gradient(to bottom,#fff,transparent); }
        @keyframes bounceY {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(7px); }
        }

        .feature-cell {
          background:#fff; padding:2.25rem 2rem;
          border:1px solid #e8e2db; transition:box-shadow .25s;
        }
        .feature-cell:hover { box-shadow:0 8px 32px rgba(26,21,16,.07); }
        .icon-sq {
          width:40px; height:40px; border:1px solid #e0dbd3;
          display:flex; align-items:center; justify-content:center;
          background:#F7F3EE; margin-bottom:1.25rem;
        }
        .step-num {
          font-family:'Playfair Display',serif; font-size:3.5rem; font-weight:700;
          color:#322d27; line-height:1; display:block; margin-bottom:1.25rem;
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .a0 { animation:fadeUp .7s .1s  both; }
        .a1 { animation:fadeUp .7s .25s both; }
        .a2 { animation:fadeUp .7s .4s  both; }
        .a3 { animation:fadeUp .7s .55s both; }
        .a4 { animation:fadeUp .7s .65s both; }

        @media(max-width:820px) {
          .hero-inner    { grid-template-columns:1fr !important; }
          .features-grid { grid-template-columns:1fr 1fr !important; }
          .steps-grid    { grid-template-columns:1fr !important; }
          .glass-stats   { display:none; }
        }
        @media(max-width:520px) {
          .features-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div className="vid-hero">

        <div className="vid-bg">
          <video autoPlay muted loop playsInline preload="auto">
            {/* Close-up: student hands typing on laptop — portal/tech academic feel */}
            <source src="https://assets.mixkit.co/videos/4763/4763-720.mp4" type="video/mp4" />
            {/* Fallback: young woman with headphones working in library with laptop */}
            <source src="https://assets.mixkit.co/videos/4531/4531-720.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="vid-overlay" />
        <div className="vid-grain" />
        <div className="vid-vignette" />

        <nav className="hero-nav">
          <div style={{ maxWidth:1120, margin:'0 auto', padding:'0 1.75rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
              <div style={{ width:30, height:30, background:'#F7F3EE', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <GraduationCap size={16} color="#1a1510" />
              </div>
              <span style={{ fontSize:'1.0625rem', fontWeight:600, color:'#F7F3EE', letterSpacing:'-0.01em' }}>uConnect</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'1.75rem' }}>
              <Link to="/login" className="nav-light">Sign in</Link>
              <Link to="/register" className="btn-cream">Get started <ArrowRight size={13} /></Link>
            </div>
          </div>
        </nav>

        <div style={{ flex:1, display:'flex', alignItems:'center', position:'relative', zIndex:5 }}>
          <div style={{ maxWidth:1120, margin:'0 auto', padding:'0 1.75rem', width:'100%' }}>
            <div className="hero-inner" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center', padding:'4rem 0 7rem' }}>

              <div>
                <h1 className="f-display a1" style={{
                  fontSize:'clamp(2.6rem, 4.5vw, 4.25rem)',
                  fontWeight:700, color:'#F7F3EE',
                  lineHeight:1.08, letterSpacing:'-0.025em',
                  marginBottom:'1.5rem',
                }}>
                  Everything your campus needs,{' '}
                  <em style={{ fontStyle:'italic', color:'#7aabff' }}>unified.</em>
                </h1>

                <p className="a2" style={{
                  fontSize:'1rem', color:'rgba(247,243,238,.62)',
                  lineHeight:1.75, maxWidth:400, marginBottom:'2.25rem',
                }}>
                  Courses, schedules, clubs, housing, and campus services — all in one platform built for modern students.
                </p>

                <div className="a3" style={{ display:'flex', gap:'.875rem', flexWrap:'wrap' }}>
                  <Link to="/register" className="btn-cream">Start free today <ArrowRight size={13} /></Link>
                  <button className="btn-ghost-light" onClick={scrollToHowItWorks}>How it works</button>
                </div>
              </div>

              <div className="glass-stats a4">
                {[
                  { val:'10K+', label:'Students active',    sub:'Across 40+ universities' },
                  { val:'50K+', label:'Problems solved',    sub:'In Skill Arena this semester' },
                  { val:'98%',  label:'User satisfaction',  sub:'Based on end-of-term surveys' },
                ].map((s, i) => (
                  <div key={i} className="glass-stat">
                    <div>
                      <div style={{
                        fontFamily:"'Playfair Display',serif",
                        fontSize:'2rem', fontWeight:700,
                        color:'#F7F3EE', letterSpacing:'-0.02em', lineHeight:1,
                      }}>{s.val}</div>
                      <div style={{
                        fontFamily:"'DM Sans',sans-serif",
                        fontSize:'.7rem', fontWeight:500,
                        color:'rgba(247,243,238,.4)',
                        marginTop:'.3rem', textTransform:'uppercase', letterSpacing:'.06em',
                      }}>{s.label}</div>
                    </div>
                    <div style={{
                      fontSize:'.72rem', color:'rgba(247,243,238,.27)',
                      fontFamily:"'DM Sans',sans-serif",
                      maxWidth:110, textAlign:'right', lineHeight:1.45,
                    }}>{s.sub}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>

      </div>

      <div style={{ borderTop:'1px solid #ddd8d0', maxWidth:1120, margin:'0 auto' }} />

      <section style={{ maxWidth:1120, margin:'0 auto', padding:'5.5rem 1.75rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1.5rem' }}>
          <div>
            <div style={{ width:36, height:2, background:'#1955e6', marginBottom:'1.25rem' }} />
            <h2 className="f-display" style={{ fontSize:'clamp(1.5rem,2.75vw,2.25rem)', fontWeight:700, color:'#1a1510', letterSpacing:'-0.02em', lineHeight:1.15 }}>
              Built for every part<br />of campus life
            </h2>
          </div>
          <p style={{ maxWidth:280, color:'#7a756f', lineHeight:1.65, fontSize:'.875rem' }}>
            Four core features designed to make your academic journey smoother.
          </p>
        </div>

        <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:'#ddd8d0' }}>
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="feature-cell">
                <div className="icon-sq"><Icon size={18} color="#1955e6" /></div>
                <h3 className="f-display" style={{ fontSize:'1.0625rem', fontWeight:600, color:'#1a1510', marginBottom:'.625rem', lineHeight:1.3 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize:'.8375rem', color:'#7a756f', lineHeight:1.65 }}>{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" style={{ background:'#1a1510', padding:'5.5rem 1.75rem' }}>
        <div style={{ maxWidth:1120, margin:'0 auto' }}>
          <div style={{ marginBottom:'3.5rem' }}>
            <div style={{ width:36, height:2, background:'#1955e6', marginBottom:'1.25rem' }} />
            <h2 className="f-display" style={{ fontSize:'clamp(1.5rem,2.75vw,2.25rem)', fontWeight:700, color:'#F7F3EE', letterSpacing:'-0.02em' }}>
              How it works
            </h2>
          </div>
          <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'3rem' }}>
            {[
              { title:'Central Dashboard',   body:'One view of all your courses, grades, schedules, and campus events. Nothing falls through the cracks.' },
              { title:'Smart Organization',  body:'AI sorts your tasks, deadlines, and clubs automatically. Focus on what matters, not on managing information.' },
              { title:'Compete & Learn',     body:'Join Skill Arena to challenge peers in live coding battles and level up your abilities over time.' },
            ].map((s, i) => (
              <div key={i} style={{ borderTop:'1px solid #2e2820', paddingTop:'1.75rem' }}>
                <span className="step-num">0{i + 1}</span>
                <h3 className="f-display" style={{ fontSize:'1.125rem', fontWeight:600, color:'#F7F3EE', marginBottom:'.75rem', lineHeight:1.3 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize:'.8375rem', color:'#6a6560', lineHeight:1.7 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:'7rem 1.75rem', background:'#F7F3EE', textAlign:'center' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <h2 className="f-display" style={{
            fontSize:'clamp(1.875rem,3.5vw,3rem)',
            fontWeight:700, color:'#1a1510',
            letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:'1.25rem',
          }}>
            Ready to organize your{' '}
            <em style={{ fontStyle:'italic', color:'#1955e6' }}>campus life?</em>
          </h2>
          <p style={{ color:'#7a756f', fontSize:'.9375rem', lineHeight:1.65, marginBottom:'2rem' }}>
            Join thousands of students mastering their academic journey.
          </p>
          <Link to="/register" className="btn-dark">Start free today <ArrowRight size={13} /></Link>
          <p style={{ marginTop:'1.25rem', fontSize:'.78rem', color:'#b0aba5' }}>
            No credit card required · Free forever for students
          </p>
        </div>
      </section>

      <div style={{ borderTop:'1px solid #ddd8d0', padding:'1.25rem 1.75rem', textAlign:'center' }}>
        <p style={{ fontSize:'.78rem', color:'#b0aba5' }}>© 2025 uConnect. All rights reserved.</p>
      </div>
    </div>
  );
}