import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap } from 'lucide-react';

const font = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3 p-6"
        style={{ backgroundColor: '#080C18', fontFamily: font }}
      >
        {/* Brand mark - smaller */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            backgroundColor: '#1A2035',
            border: '1px solid #1C2333',
          }}
        >
          <GraduationCap style={{ width: 16, height: 16, color: '#3B82F6' }} />
        </div>

        {/* Spinner */}
        <div className="relative" style={{ width: 18, height: 18 }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: '1.5px solid #1C2333' }}
          />
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: '1.5px solid transparent',
              borderTopColor: '#3B82F6',
            }}
          />
        </div>

        <p className="text-xs font-medium tracking-tight" style={{ color: '#3D4A5C' }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
