import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

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
    <div style={{ display: 'flex', height: '100vh', background: '#F7F3EE', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }

        .search-input {
          height: 30px;
          width: 180px;
          padding: 0 0.625rem 0 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          background: #fff;
          border: 1.5px solid #ddd8d0;
          color: #1a1510;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: #1955e6; }
        .search-input::placeholder { color: #c0bbb5; }

        .bell-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; cursor: pointer;
          color: #8a857f; position: relative;
          transition: color 0.15s;
        }
        .bell-btn:hover { color: #1a1510; }

        .layout-main::-webkit-scrollbar { width: 4px; }
        .layout-main::-webkit-scrollbar-track { background: transparent; }
        .layout-main::-webkit-scrollbar-thumb { background: #ddd8d0; }
      `}</style>

      <Sidebar />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: 52, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.25rem',
          background: '#F7F3EE',
          borderBottom: '1px solid #ddd8d0',
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', fontWeight: 700,
            color: '#1a1510', letterSpacing: '-0.01em',
            margin: 0,
          }}>{title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* Search */}
            <div style={{ position: 'relative' }} className="search-wrap">
              <style>{`@media(max-width:767px){ .search-wrap{ display:none; } }`}</style>
              <Search size={12} color="#c0bbb5" style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="search-input"
              />
            </div>

            {/* Bell */}
            <button className="bell-btn" onClick={() => navigate('/app/notifications')}>
              <Bell size={15} />
              <span style={{
                position: 'absolute', top: 5, right: 5,
                width: 5, height: 5, borderRadius: '50%',
                background: '#e8a030',
                outline: '2px solid #F7F3EE',
              }} />
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="layout-main" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}