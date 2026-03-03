import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import {
  LayoutDashboard, BookOpen, UserCheck, CreditCard, MessageSquare,
  Calendar, Users, Trophy, Settings, LogOut, GraduationCap,
  Menu, X, Clock, TrendingUp,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Academic',
    items: [
      { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { name: 'Courses', href: '/app/courses', icon: BookOpen },
      { name: 'Activities', href: '/app/activities', icon: Clock },
      { name: 'Grades', href: '/app/grades', icon: TrendingUp },
      { name: 'Enrollment', href: '/app/enrollment', icon: UserCheck },
      { name: 'Payments', href: '/app/payments', icon: CreditCard },
    ],
  },
  {
    label: 'Campus Life',
    items: [
      { name: 'Advising', href: '/app/advising', icon: MessageSquare },
      { name: 'Events', href: '/app/events', icon: Calendar },
      { name: 'Clubs', href: '/app/clubs', icon: Users },
      { name: 'Skill Arena', href: '/app/skill-arena', icon: Trophy },
    ],
  },
];

const T = {
  bg:        '#0D1117',
  border:    '#1C2333',
  hover:     '#161B27',
  activeBg:  '#1A2035',
  activeBar: '#3B82F6',
  text1:     '#E6EDF3',
  text2:     '#7D8590',
  text3:     '#3D4A5C',
  accent:    '#3B82F6',
};

const font = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

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

  const initial = (user?.email?.[0] ?? 'U').toUpperCase();
  const username = user?.email?.split('@')[0] ?? 'Student';

  const NavItem = ({ item, onClick }) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={[
          'group relative flex items-center gap-2 px-2.5 h-7 rounded-md',
          'text-[13px] leading-none transition-all duration-150 select-none',
          active
            ? 'text-[#E6EDF3] font-medium'
            : 'text-[#7D8590] hover:text-[#E6EDF3]',
        ].join(' ')}
        style={{
          fontFamily: font,
          backgroundColor: active ? T.activeBg : 'transparent',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = T.hover; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        {active && (
          <span
            className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-3.5 rounded-r-full"
            style={{ backgroundColor: T.activeBar }}
          />
        )}
        <Icon
          className="shrink-0 transition-colors"
          style={{
            width: 13, height: 13,
            color: active ? T.accent : 'currentColor',
          }}
        />
        <span className="flex-1 truncate">{item.name}</span>
      </Link>
    );
  };

  const Body = ({ onClose }) => (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: T.bg, fontFamily: font }}
    >
      {/* Logo row - compact */}
      <div
        className="flex h-11 shrink-0 items-center justify-between px-3.5"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: T.accent }}
          >
            <GraduationCap style={{ width: 13, height: 13, color: '#fff' }} />
          </div>
          <span
            className="text-[13px] font-semibold tracking-tight leading-none"
            style={{ color: T.text1 }}
          >
            uConnect
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 transition-all duration-150"
            style={{ color: T.text2 }}
            onMouseEnter={e => { 
              e.currentTarget.style.color = T.text1; 
              e.currentTarget.style.backgroundColor = T.hover; 
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.color = T.text2; 
              e.currentTarget.style.backgroundColor = 'transparent'; 
            }}
          >
            <X style={{ width: 13, height: 13 }} />
          </button>
        )}
      </div>

      {/* Nav - tighter spacing */}
      <nav className="flex-1 overflow-y-auto px-1.5 py-2.5 space-y-2.5 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p
              className="px-2.5 mb-1.5 text-[11px] font-medium uppercase tracking-wider leading-none"
              style={{ color: T.text3 }}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer - compact */}
      <div style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="px-1.5 pt-1.5">
          <NavItem
            item={{ name: 'Settings', href: '/app/settings', icon: Settings }}
            onClick={() => setMobileOpen(false)}
          />
        </div>

        <div className="p-2.5">
          <div
            className="flex items-center gap-2 px-1.5 py-1.5 rounded-md cursor-default"
            style={{ borderTop: `1px solid ${T.border}` }}
          >
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
              style={{
                backgroundColor: '#1A2035',
                border: `1px solid #253352`,
                color: '#60A5FA',
              }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[12px] font-medium truncate leading-tight"
                style={{ color: T.text1 }}
              >
                {username}
              </p>
              <p className="text-[10px] truncate leading-tight" style={{ color: T.text3 }}>
                {user?.email}
              </p>
            </div>
            <button
              title="Sign out"
              onClick={() => setConfirmLogout(true)}
              className="shrink-0 rounded-md p-1 transition-all duration-150"
              style={{ color: T.text2 }}
              onMouseEnter={e => { 
                e.currentTarget.style.color = '#F87171'; 
                e.currentTarget.style.backgroundColor = '#1F1215'; 
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.color = T.text2; 
                e.currentTarget.style.backgroundColor = 'transparent'; 
              }}
            >
              <LogOut style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar - compact */}
      {!mobileOpen && (
        <div
          className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-11 items-center justify-between px-3.5"
          style={{
            backgroundColor: T.bg,
            borderBottom: `1px solid ${T.border}`,
            fontFamily: font,
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5"
            style={{ color: T.text2 }}
          >
            <Menu style={{ width: 15, height: 15 }} />
          </button>
          <div className="flex items-center gap-1.5">
            <div
              className="flex h-5.5 w-5.5 items-center justify-center rounded-md"
              style={{ backgroundColor: T.accent }}
            >
              <GraduationCap style={{ width: 12, height: 12, color: '#fff' }} />
            </div>
            <span className="text-[13px] font-semibold leading-none" style={{ color: T.text1 }}>
              uConnect
            </span>
          </div>
          <div className="w-6" />
        </div>
      )}

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-52 shrink-0 flex-col h-screen sticky top-0"
        style={{ borderRight: `1px solid ${T.border}` }}
      >
        <Body />
      </aside>

      {mobileOpen && (
        <aside
          className="lg:hidden fixed top-0 left-0 z-50 w-52 h-screen flex flex-col shadow-2xl"
          style={{ borderRight: `1px solid ${T.border}` }}
        >
          <Body onClose={() => setMobileOpen(false)} />
        </aside>
      )}

      {/* Sign-out modal - compact */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          style={{ fontFamily: font }}
        >
          <div
            className="w-full max-w-sm rounded-xl p-4 shadow-2xl"
            style={{
              backgroundColor: '#0D1117',
              border: `1px solid ${T.border}`,
            }}
          >
            <p
              className="text-[13px] font-medium mb-1.5 leading-tight"
              style={{ color: T.text1 }}
            >
              Sign out of uConnect?
            </p>
            <p className="text-[12px] mb-4 leading-tight" style={{ color: T.text2 }}>
              You'll be redirected to login.
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 h-7 rounded-lg text-[12px] font-medium transition-all duration-150"
                style={{
                  backgroundColor: T.hover,
                  border: `1px solid ${T.border}`,
                  color: T.text1,
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1C2333'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = T.hover}
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 h-7 rounded-lg text-[12px] font-medium transition-all duration-150"
                style={{ backgroundColor: '#1F1215', border: '1px solid #3F1B1B', color: '#F87171' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2C1414'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1F1215'}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
