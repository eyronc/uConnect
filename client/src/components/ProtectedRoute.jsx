import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#F7F3EE',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .load-wrap { animation: fadeIn 0.4s ease both; }
        `}</style>

        <div className="load-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          {/* Logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 30, height: 30,
              background: '#1a1510',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GraduationCap size={16} color="#F7F3EE" />
            </div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.0625rem', fontWeight: 600,
              color: '#1a1510', letterSpacing: '-0.01em',
            }}>uConnect</span>
          </div>

          {/* Spinner — thin square border, one side colored */}
          <div style={{
            width: 20, height: 20,
            border: '2px solid #e0dbd3',
            borderTopColor: '#1a1510',
            borderRadius: 0,
            animation: 'spin 0.75s linear infinite',
          }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.75rem', fontWeight: 500,
            color: '#b0aba5',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>Loading</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}