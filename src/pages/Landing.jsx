import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Trophy, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: GraduationCap,
      title: 'Unified Dashboard',
      description: 'All your academic information in one clean interface',
    },
    {
      icon: BookOpen,
      title: 'Academic Tracking', 
      description: 'Real-time grades, courses, and progress monitoring',
    },
    {
      icon: Users,
      title: 'Smart Advising',
      description: 'AI-powered guidance and advisor connections',
    },
    {
      icon: Trophy,
      title: 'Skill Arena',
      description: 'Compete in coding challenges and climb leaderboards',
    },
  ];

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float bg-blue-400" />
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed bg-cyan-400" />

      {/* Nav */}
      <nav className="backdrop-blur-xl bg-white/90 border-b border-white/30 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-7 w-7 text-white drop-shadow-sm" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">uConnect</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm">
                Sign in
              </Link>
              <Link to="/register" className="group bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-3 text-sm font-bold text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:scale-[1.02]">
                <span className="group-hover:translate-x-1 transition-transform duration-300">Get Started →</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 sm:px-8 pt-24 pb-28 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold mb-8 bg-blue-100 text-blue-700 backdrop-blur-sm border border-blue-200/50">
              <Sparkles className="w-4 h-4" />
              Skill Arena Live Now
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight" style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}>
              Everything your campus needs
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">in one place</span>
            </h1>

            <p className="text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed text-slate-600" style={{ lineHeight: '1.6' }}>
              Courses, schedules, clubs, housing, and campus services — unified into a single
              platform built for modern students.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 inline-flex items-center justify-center gap-3 backdrop-blur-sm"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto px-10 py-5 font-semibold text-lg rounded-3xl border-2 border-slate-200 hover:border-blue-300 hover:bg-slate-50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
              >
                See How It Works
              </button>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl p-10 border border-slate-200/50 bg-white/80 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-3 hover:border-blue-200/50 transition-all duration-500 animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-100/50 hover:border-blue-200 hover:shadow-lg hover:rotate-6 transition-all duration-500 mx-auto`}>
                    <Icon className="w-10 h-10 text-blue-600 hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 hover:text-blue-700 transition-colors">{feature.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed" style={{ lineHeight: '1.6' }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 sm:px-8 py-28 relative overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float bg-blue-400" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6" style={{ lineHeight: '1.15' }}>
              How it works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three simple steps to organize your entire campus life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                number: '1',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-700',
                title: 'Central Dashboard',
                description: 'One view of all your courses, grades, schedules, and campus events.',
              },
              {
                number: '2',
                bgColor: 'bg-cyan-100', 
                textColor: 'text-cyan-700',
                title: 'Smart Organization',
                description: 'AI sorts your tasks, deadlines, and clubs automatically. Never miss anything.',
              },
              {
                number: '3',
                bgColor: 'bg-indigo-100',
                textColor: 'text-indigo-700',
                title: 'Compete & Learn',
                description: 'Join Skill Arena to challenge peers and level up your abilities.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="text-center hover:-translate-y-4 transition-all duration-500 animate-slide-up group"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 ${step.bgColor} border-4 border-white/50 shadow-xl group-hover:scale-110 transition-all duration-500 animate-scale-in`} style={{ animationDelay: `${idx * 150}ms` }}>
                  <span className={`text-4xl font-black ${step.textColor}`}>{step.number}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 group-hover:text-blue-700 transition-colors">{step.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed max-w-sm mx-auto" style={{ lineHeight: '1.6' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 sm:px-8 py-24 relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700">
        <div className="absolute inset-0 opacity-10 animate-pattern" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 text-center text-white">
            {[
              { stat: '10K+', label: 'Students Active' },
              { stat: '50K+', label: 'Problems Solved' },
              { stat: '98%', label: 'User Satisfaction' },
            ].map((item, idx) => (
              <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="text-5xl lg:text-6xl font-black mb-4 animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  {item.stat}
                </div>
                <div className="text-xl font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 sm:px-8 py-28 relative overflow-hidden bg-white/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-8" style={{ lineHeight: '1.15' }}>
            Ready to organize your 
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">campus life?</span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Join thousands of students mastering their academic journey
          </p>
          <Link
            to="/register"
            className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 inline-flex items-center gap-3 backdrop-blur-sm"
          >
            <span className="group-hover:translate-x-1 transition-transform duration-300">Start Free Today</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <p className="text-sm mt-8 text-slate-500 font-medium">
            No credit card required • Free forever for students
          </p>
        </div>
      </section>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        @keyframes scale-in {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes pattern {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, 10px); }
          75% { transform: translate(-10px, -10px); }
        }
        .animate-pattern { animation: pattern 20s linear infinite; }
      `}</style>
    </div>
  );
}
