import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  CreditCard,
  MessageSquare,
  Calendar,
  Users,
  Trophy,
  Settings,
  LogOut,
  GraduationCap,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', href: '/app/courses', icon: BookOpen },
  { name: 'Enrollment', href: '/app/enrollment', icon: UserCheck },
  { name: 'Payments', href: '/app/payments', icon: CreditCard },
  { name: 'Advising', href: '/app/advising', icon: MessageSquare },
  { name: 'Events', href: '/app/events', icon: Calendar },
  { name: 'Clubs', href: '/app/clubs', icon: Users },
  { name: 'Skill Arena', href: '/app/skill-arena', icon: Trophy },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (href) => location.pathname === href;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-[#1C1917] border-r border-[#292524]">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-[#292524]">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-white">uConnect</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#292524]">
        <Link
          to="/app/settings"
          className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors border-b border-[#292524] ${
            isActive('/app/settings')
              ? 'text-white bg-white/15'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/20 border border-[#2563EB]/30">
              <span className="text-sm font-semibold text-[#60A5FA]">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email?.split('@')[0] || 'Student'}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
