import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/app/dashboard');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    const { error } = await signInDemo();

    if (error) {
      setError('Demo account unavailable. Please try again.');
      setLoading(false);
    } else {
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-[#0F172A] p-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-semibold">uConnect</span>
        </div>

        <div>
          <h1 className="font-serif text-5xl font-bold leading-tight">
            Everything your campus needs,{' '}
            <span className="text-[#60A5FA]">in one place.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-300">
            Courses, schedules, clubs, housing, and campus services — unified into a single
            platform built for students.
          </p>

          <div className="mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl font-bold text-gray-500">48k</div>
              <div className="pt-1">
                <p className="text-sm text-gray-400">Students across</p>
                <p className="text-sm text-gray-400">partner campuses</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-4xl font-bold text-gray-500">200+</div>
              <div className="pt-1">
                <p className="text-sm text-gray-400">Integrated campus</p>
                <p className="text-sm text-gray-400">services & tools</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-4xl font-bold text-gray-500">99.9%</div>
              <div className="pt-1">
                <p className="text-sm text-gray-400">Platform uptime</p>
                <p className="text-sm text-gray-400">this semester</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-green-400">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            All systems operational
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#1C1917]">uConnect</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1C1917]">Sign in</h2>
            <p className="mt-2 text-sm text-[#78716C]">Use your university email to continue</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1C1917]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78716C]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="h-12 w-full rounded-lg border border-[#E8E4DE] bg-white pl-10 pr-4 text-[#1C1917] placeholder-[#A8A29E] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-[#1C1917]">Password</label>
                <button
                  type="button"
                  className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#2563EB]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78716C]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-[#E8E4DE] bg-white pl-10 pr-12 text-[#1C1917] placeholder-[#A8A29E] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] transition-colors hover:text-[#1C1917]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="keepSignedIn"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="h-4 w-4 rounded border-[#E8E4DE] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
              <label htmlFor="keepSignedIn" className="ml-2 text-sm text-[#78716C]">
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-[#2563EB] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-[#E8E4DE]" />
            <span className="px-4 text-sm text-[#78716C]">OR</span>
            <div className="flex-1 border-t border-[#E8E4DE]" />
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#E8E4DE] bg-white font-medium text-[#1C1917] transition-colors hover:bg-[#F8F7F4] disabled:opacity-50"
          >
            <div className="h-2 w-2 rounded-full bg-[#F59E0B]" />
            Continue with demo account
          </button>

          <p className="mt-8 text-center text-sm text-[#78716C]">
            No account yet?{' '}
            <Link to="/register" className="font-medium text-[#2563EB] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
