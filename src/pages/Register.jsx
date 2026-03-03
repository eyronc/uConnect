import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7F4] p-8">
        <div className="w-full max-w-md rounded-2xl border border-[#E8E4DE] bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-[#1C1917]">Check your email</h2>
          <p className="mb-6 text-sm text-[#78716C]">
            We've sent a verification link to <strong>{email}</strong>. Click the link to verify
            your account and get started.
          </p>
          <Link
            to="/login"
            className="inline-block rounded-lg bg-[#2563EB] px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Return to Sign in
          </Link>
        </div>
      </div>
    );
  }

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
            Join thousands of students{' '}
            <span className="text-[#60A5FA]">already connected.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-300">
            Get instant access to your academic dashboard, course materials, campus events, and more.
          </p>
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
            <h2 className="text-3xl font-bold text-[#1C1917]">Create your account</h2>
            <p className="mt-2 text-sm text-[#78716C]">Start your academic journey with uConnect</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1C1917]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78716C]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="h-12 w-full rounded-lg border border-[#E8E4DE] bg-white pl-10 pr-4 text-[#1C1917] placeholder-[#A8A29E] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  required
                />
              </div>
            </div>

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
              <label className="mb-2 block text-sm font-medium text-[#1C1917]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78716C]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-[#E8E4DE] bg-white pl-10 pr-12 text-[#1C1917] placeholder-[#A8A29E] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] transition-colors hover:text-[#1C1917]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-[#78716C]">
                Must be at least 6 characters long
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-[#2563EB] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#78716C]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#2563EB] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
