import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, Users, Plus, Trash2, Search, 
  Filter, CheckCircle2, GraduationCap, Sparkles,
  ArrowRight, Info
} from 'lucide-react';

export default function Enrollment() {
  const { user } = useAuth();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          supabase.from('courses').select('*').eq('status', 'active'),
          supabase
            .from('enrollments')
            .select('*, courses(*)')
            .eq('user_id', user.id)
            .eq('status', 'active'),
        ]);

        const enrolledData = enrollmentsRes.data?.map(e => e.courses) || [];
        const enrolledIds = new Set(enrolledData.map(c => c.id));
        const available = coursesRes.data?.filter((c) => !enrolledIds.has(c.id)) || [];

        setAvailableCourses(available);
        setEnrolledCourses(enrolledData);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleEnroll = async (courseId) => {
    try {
      const courseToMove = availableCourses.find((c) => c.id === courseId);
      if (!courseToMove) return;

      const { error: insertError } = await supabase
        .from('enrollments')
        .insert([{ 
          user_id: user.id, 
          course_id: courseId, 
          status: 'active' 
        }]);

      if (insertError) throw insertError;

      await supabase.from('payments').insert([{ 
        user_id: user.id, 
        course_id: courseId,
        description: `Tuition Fee: ${courseToMove.course_name}`,
        amount: 3000,
        status: 'pending',
        semester: 'First Semester 2026'
      }]);

      setEnrolledCourses(prev => [...prev, courseToMove]);
      setAvailableCourses(prev => prev.filter((c) => c.id !== courseId));
    } catch (error) {
      alert(`Failed to enroll: ${error.message}`);
    }
  };
  
  const handleDrop = async (courseId) => {
    if (!confirm('Are you sure you want to drop this course?')) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;

      const courseToMove = enrolledCourses.find((c) => c.id === courseId);
      setAvailableCourses(prev => [...prev, courseToMove]);
      setEnrolledCourses(prev => prev.filter((c) => c.id !== courseId));
    } catch (error) {
      alert('Failed to drop course');
    }
  };

  const filteredCourses = availableCourses.filter((course) => {
    const matchesSearch =
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDepartment === 'all' || course.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const departments = [...new Set(availableCourses.map((c) => c.department))];

  if (loading) {
    return (
      <Layout title="Enrollment">
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading Course Catalog...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Enrollment">
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">Course Enrollment</h2>
              <p className="text-slate-400 mt-2 max-w-lg font-medium">
                Build your ideal academic schedule for the <span className="text-white">First Semester 2026</span>.
              </p>
            </div>
            <div className="flex gap-4">
               <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Credits</p>
                  <p className="text-2xl font-black text-white">{enrolledCourses.reduce((acc, c) => acc + (c.credits || 0), 0)}</p>
               </div>
            </div>
          </div>
          <GraduationCap className="absolute -bottom-10 -right-10 h-64 w-64 text-white/[0.02] -rotate-12" />
        </div>

        {/* --- My Schedule Section --- */}
        {enrolledCourses.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-3 ml-2">
              <div className="h-8 w-1 bg-emerald-500 rounded-full" />
              My Current Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="group relative bg-emerald-500/[0.03] border border-emerald-500/20 rounded-[1.5rem] p-5 flex items-center justify-between backdrop-blur-sm transition-all hover:bg-emerald-500/[0.06]">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-100 text-sm">{course.course_name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-0.5">
                        {course.course_code} • {course.credits} Units
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDrop(course.id)}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-white/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- Search & Filter Bar --- */}
        <div className="sticky top-4 z-30 flex flex-col md:flex-row gap-4 bg-slate-950/80 backdrop-blur-xl p-4 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full md:w-64 h-12 pl-12 pr-10 bg-white/5 border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Course Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 transition-all duration-300 hover:bg-slate-900/60 hover:border-white/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/5"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-tighter rounded-full border border-white/5">
                    {course.credits} Units
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{course.course_code}</p>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {course.course_name}
                  </h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {course.description || 'Comprehensive curriculum covering foundational principles and advanced industry practices.'}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-800" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">
                    {course.enrolled_count}/{course.max_students}
                  </span>
                </div>
                
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all transform active:scale-95"
                >
                  Enroll <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- Empty State --- */}
        {filteredCourses.length === 0 && (
          <div className="bg-slate-900/20 border border-dashed border-white/10 rounded-[3rem] p-24 text-center">
            <div className="h-20 w-20 bg-slate-900 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Search className="h-8 w-8 text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No Courses Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">
              We couldn't find any courses matching your search. Try adjusting your filters or department.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}