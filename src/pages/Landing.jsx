import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Trophy } from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: GraduationCap,
      title: 'Unified Dashboard',
      description: 'All your academic information in one place',
    },
    {
      icon: BookOpen,
      title: 'Academic Tracking',
      description: 'Monitor your courses, grades, and progress',
    },
    {
      icon: Users,
      title: 'Smart Advising',
      description: 'Connect with advisors and get guidance',
    },
    {
      icon: Trophy,
      title: 'Skill Arena',
      description: 'Compete and improve your skills',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <nav className="border-b border-[#E8E4DE] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#1C1917]">uConnect</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#1C1917] transition-colors hover:text-[#2563EB]"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-[#2563EB] px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="font-serif text-6xl font-bold leading-tight text-[#1C1917]">
            Everything your campus needs,{' '}
            <span className="text-[#2563EB]">in one place.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#78716C]">
            Courses, schedules, clubs, housing, and campus services — unified into a single
            platform built for students.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-[#2563EB] px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-[#E8E4DE] bg-white px-8 py-3 text-base font-medium text-[#1C1917] transition-colors hover:bg-[#F8F7F4]"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8E4DE] bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl font-bold text-[#1C1917]">
              Built for modern students
            </h2>
            <p className="mt-4 text-lg text-[#78716C]">
              Everything you need to succeed, all in one platform
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#E8E4DE] bg-[#F8F7F4] p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-[#2563EB]/10 p-3">
                    <Icon className="h-6 w-6 text-[#2563EB]" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#1C1917]">{feature.title}</h3>
                  <p className="text-sm text-[#78716C]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8E4DE] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-2xl bg-[#1C1917] p-12 text-center text-white">
            <Trophy className="mx-auto mb-6 h-16 w-16 text-[#F59E0B]" />
            <h2 className="font-serif text-4xl font-bold">Skill Arena</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Challenge yourself, compete with peers, and climb the leaderboard. Earn recognition
              for your academic prowess.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-block rounded-lg bg-[#F59E0B] px-8 py-3 text-base font-medium text-[#1C1917] transition-opacity hover:opacity-90"
            >
              Start Competing
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E8E4DE] bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-[#1C1917]">uConnect</span>
            </div>
            <p className="text-sm text-[#78716C]">
              &copy; 2024 uConnect. Empowering students worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
