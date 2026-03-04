import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import {
  LayoutDashboard, BookOpen, UserCheck, CreditCard, MessageSquare,
  Calendar, Users, Trophy, Settings, LogOut, GraduationCap,
  Menu, X, Clock, TrendingUp, HelpCircle,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Academic',
    items: [
      { name: 'Dashboard',  href: '/app/dashboard',  icon: LayoutDashboard },
      { name: 'Courses',    href: '/app/courses',     icon: BookOpen },
      { name: 'Activities', href: '/app/activities',  icon: Clock },
      { name: 'Grades',     href: '/app/grades',      icon: TrendingUp },
      { name: 'Enrollment', href: '/app/enrollment',  icon: UserCheck },
      { name: 'Payments',   href: '/app/payments',    icon: CreditCard },
    ],
  },
  {
    label: 'Campus Life',
    items: [
      { name: 'Advising',    href: '/app/advising',    icon: MessageSquare },
      { name: 'Events',      href: '/app/events',      icon: Calendar },
      { name: 'Clubs',       href: '/app/clubs',       icon: Users },
      { name: 'Skill Arena', href: '/app/skill-arena', icon: Trophy },
    ],
  },
  {
    label: 'Support',
    items: [
      { name: 'Support', href: '/app/support', icon: HelpCircle },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const isActive = (href) => location.pathname === href;

  const handleSignOut = async () => {
    setConfirmLogout(false);
    await signOut();
    navigate('/login');
  };

  const initial  = (user?.email?.[0] ?? 'U').toUpperCase();
  const username = user?.email?.split('@')[0] ?? 'Student';

  const NavItem = ({ item, onClick }) => {
    const active = isActive(item.href);
    const Icon   = item.icon;
    return (
      <Link
        to={item.href}
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.625rem',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.8125rem',
          fontWeight: active ? 600 : 400,
          color: active ? '#1a1510' : '#6b6460',
          background: active ? '#ede8e2' : 'transparent',
          borderLeft: active ? '2px solid #1955e6' : '2px solid transparent',
          textDecoration: 'none',
          transition: 'all 0.15s',
          userSelect: 'none',
          letterSpacing: '0.005em',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f0ebe4'; e.currentTarget.style.color = '#1a1510'; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b6460'; } }}
      >
        <Icon size={13} style={{ color: active ? '#1955e6' : 'currentColor', flexShrink: 0 }} />
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
      </Link>
    );
  };

  const Body = ({ onClose }) => (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#F7F3EE',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Logo */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 1rem',
        borderBottom: '1px solid #ddd8d0', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 26, height: 26, background: '#1a1510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={14} color="#F7F3EE" />
          </div>
          <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1a1510', letterSpacing: '-0.01em' }}>
            uConnect
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a857f', padding: 4, display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1a1510'}
            onMouseLeave={e => e.currentTarget.style.color = '#8a857f'}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.875rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p style={{
              fontSize: '0.65rem', fontWeight: 600, color: '#b0aba5',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0 0.625rem', marginBottom: '0.375rem',
            }}>{group.label}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {group.items.map(item => (
                <NavItem key={item.href} item={item} onClick={() => setMobileOpen(false)} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #ddd8d0', flexShrink: 0 }}>
        <div style={{ padding: '0.375rem 0.5rem' }}>
          <NavItem item={{ name: 'Settings', href: '/app/settings', icon: Settings }} onClick={() => setMobileOpen(false)} />
        </div>
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #ddd8d0', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: '#1a1510', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, color: '#F7F3EE',
          }}>{initial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a1510', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{username}</p>
            <p style={{ fontSize: '0.68rem', color: '#a0a09c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{user?.email}</p>
          </div>
          <button
            title="Sign out"
            onClick={() => setConfirmLogout(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0aba5', padding: 4, display: 'flex', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#c83030'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#b0aba5'; }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Mobile top bar */}
      {!mobileOpen && (
        <div style={{
          display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
          height: 52, background: '#F7F3EE', borderBottom: '1px solid #ddd8d0',
          alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem',
          fontFamily: "'DM Sans', sans-serif",
        }} className="mob-bar">
          <style>{`@media(max-width:1023px){ .mob-bar{ display:flex !important; } }`}</style>
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6460', padding: 4 }}>
            <Menu size={16} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 24, height: 24, background: '#1a1510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={12} color="#F7F3EE" />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1510' }}>uConnect</span>
          </div>
          <div style={{ width: 24 }} />
        </div>
      )}

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(26,21,16,0.4)' }}
             onClick={() => setMobileOpen(false)} className="mob-overlay">
          <style>{`@media(max-width:1023px){ .mob-overlay{ display:block !important; } }`}</style>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside style={{
        width: 200, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
        borderRight: '1px solid #ddd8d0', display: 'none',
      }} className="desk-sidebar">
        <style>{`@media(min-width:1024px){ .desk-sidebar{ display:block !important; } }`}</style>
        <Body />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <aside style={{
          position: 'fixed', top: 0, left: 0, zIndex: 50,
          width: 200, height: '100vh',
          borderRight: '1px solid #ddd8d0',
          boxShadow: '4px 0 24px rgba(26,21,16,0.12)',
        }}>
          <Body onClose={() => setMobileOpen(false)} />
        </aside>
      )}

      {/* Sign-out modal */}
      {confirmLogout && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(26,21,16,0.5)', padding: '1rem',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <div style={{
            width: '100%', maxWidth: 360, background: '#F7F3EE',
            border: '1px solid #ddd8d0', padding: '1.75rem',
            boxShadow: '0 16px 48px rgba(26,21,16,0.16)',
          }}>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1a1510', marginBottom: '0.375rem' }}>
              Sign out of uConnect?
            </p>
            <p style={{ fontSize: '0.8375rem', color: '#8a857f', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              You'll be redirected to the login page.
            </p>
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <button onClick={() => setConfirmLogout(false)} style={{
                flex: 1, height: 40, background: '#fff', border: '1.5px solid #ddd8d0',
                color: '#1a1510', fontSize: '0.8rem', fontWeight: 600,
                letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#1a1510'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#ddd8d0'}>
                Cancel
              </button>
              <button onClick={handleSignOut} style={{
                flex: 1, height: 40, background: '#fff4f4', border: '1.5px solid #f8c8c8',
                color: '#c83030', fontSize: '0.8rem', fontWeight: 600,
                letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff4f4'}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}