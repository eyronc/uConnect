import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

const T = {
  canvas:    '#080C18',
  header:    '#0D1117',
  border:    '#1C2333',
  text1:     '#E6EDF3',
  text2:     '#7D8590',
  text3:     '#3D4A5C',
  inputBg:   '#0D1117',
  inputBorder:'#21262D',
  accent:    '#3B82F6',
};

const font = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export default function Layout({ children, title }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: T.canvas, fontFamily: font }}
    >
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* ── Header ── Compact */}
        <header
          className="flex h-11 shrink-0 items-center justify-between px-4"
          style={{
            backgroundColor: T.header,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          {/* Page title */}
          <h1
            className="text-[13px] font-medium tracking-tight leading-none"
            style={{ color: T.text1 }}
          >
            {title}
          </h1>

          <div className="flex items-center gap-1.5">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ width: 12, height: 12, color: T.text3 }}
              />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                style={{
                  fontFamily: font,
                  height: 28,
                  width: 180,
                  paddingLeft: 26,
                  paddingRight: 10,
                  fontSize: 12,
                  backgroundColor: T.inputBg,
                  border: `1px solid ${T.inputBorder}`,
                  borderRadius: 5,
                  color: T.text1,
                  outline: 'none',
                }}
                onFocus={e => {
                  e.target.style.borderColor = T.accent;
                  e.target.style.boxShadow = `0 0 0 2px rgba(59,130,246,.15)`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = T.inputBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Bell */}
            <button
              onClick={() => navigate('/app/notifications')}
              className="relative flex items-center justify-center rounded-md transition-all duration-150 p-1.5"
              style={{
                width: 28, height: 28,
                color: T.text2,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#161B27';
                e.currentTarget.style.color = T.text1;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = T.text2;
              }}
            >
              <Bell style={{ width: 14, height: 14 }} />
              {/* Notification dot */}
              <span
                className="absolute -top-1 -right-1 rounded-full"
                style={{
                  width: 5, height: 5,
                  backgroundColor: '#F59E0B',
                  outline: `2px solid ${T.header}`,
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
                }}
              />
            </button>
          </div>
        </header>

        {/* ── Main content ── Compact padding */}
        <main
          className="flex-1 overflow-y-auto scrollbar-thin"
          style={{ padding: 20, fontSize: '1rem' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
