import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  User, 
  TrendingUp, 
  ChartBar as BarChart3, 
  CircleCheck as CheckCircle2, 
  ChevronRight, 
  Loader2, 
  X, 
  CheckSquare, 
  Square, 
  Lock,
  AlertCircle
} from 'lucide-react';

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchCoursesAndProgress = useCallback(async () => {
    try {
      // 1. Fetch Enrollments and join Course details
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('*, courses (*)')
        .eq('user_id', user?.id)
        .eq('status', 'active');

      if (enrollError) throw enrollError;

      // 2. Fetch Payments for this user
      const { data: payments } = await supabase
        .from('payments')
        .select('course_id, status')
        .eq('user_id', user?.id)
        .eq('status', 'paid');

      // Create a set of paid course IDs for O(1) lookup
      const paidCourseIds = new Set(payments?.map(p => p.course_id));

      // 3. Fetch Tasks
      const { data: allTasks } = await supabase
        .from('course_tasks')
        .select('*')
        .eq('user_id', user?.id);

      // 4. Filter and Map: Only keep courses that are PAID
      const processedCourses = (enrollments || [])
        .filter(enr => paidCourseIds.has(enr.course_id)) 
        .map(enr => {
          const courseTasks = allTasks?.filter(t => t.course_id === enr.course_id) || [];
          const completed = courseTasks.filter(t => t.is_completed).length;
          const total = courseTasks.length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          return { 
            ...enr, 
            progress: percent, 
            taskCount: total,
            completedCount: completed 
          };
        });

      setEnrolledCourses(processedCourses);
      setTasks(allTasks || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    fetchCoursesAndProgress();

    // Subscribe to all relevant changes
    const channel = supabase.channel('academic_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, fetchCoursesAndProgress)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'course_tasks' }, fetchCoursesAndProgress)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, fetchCoursesAndProgress)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, fetchCoursesAndProgress]);

  const toggleTask = async (taskId, currentStatus) => {
    const { error } = await supabase
      .from('course_tasks')
      .update({ is_completed: !currentStatus })
      .eq('id', taskId);
    
    if (error) console.error("Update failed:", error);
    // Realtime will trigger the refresh automatically
  };

  if (loading) {
    return (
      <Layout title="My Courses">
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 animate-pulse text-sm">Validating enrollment & payments...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Courses">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">My Classroom</h2>
            <p className="text-slate-400 mt-1">
              Showing <span className="text-primary font-semibold">{enrolledCourses.length}</span> paid subjects
            </p>
          </div>
          <button
            className="px-5 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-xl font-semibold transition-all flex items-center gap-2"
            onClick={() => navigate('/app/payments')}
          >
            <AlertCircle className="h-4 w-4" />
            Payment Portal
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl p-20 text-center">
            <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Access Restricted</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Your courses will appear here once the tuition payment for this semester is processed and confirmed.
            </p>
            <button
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
              onClick={() => navigate('/app/payments')}
            >
              Verify Payment Status
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enr) => (
              <div key={enr.id} className="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300">
                <div className="p-6 bg-gradient-to-br from-slate-800/50 to-transparent">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">
                      Paid
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                    {enr.courses?.course_name}
                  </h3>
                  <p className="text-slate-500 text-xs font-mono">{enr.courses?.course_code}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase">
                      <span className="text-slate-500">Subject Progress</span>
                      <span className="text-white">{enr.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                        style={{ width: `${enr.progress}%` }} 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedCourse(enr)}
                    className="w-full py-3 bg-slate-800 hover:bg-primary text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Side Panel */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-slate-950 h-full shadow-2xl border-l border-slate-800 p-8 flex flex-col animate-in slide-in-from-right duration-300"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Active Session</span>
              </div>
              <button 
                onClick={() => setSelectedCourse(null)} 
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-10">
              <h4 className="text-3xl font-black text-white leading-tight mb-2">
                {selectedCourse.courses?.course_name}
              </h4>
              <div className="flex items-center gap-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {selectedCourse.courses?.instructor}</span>
                <span>•</span>
                <span className="font-mono">{selectedCourse.courses?.course_code}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div className="flex justify-between items-end">
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Course Syllabus</p>
                <p className="text-xs font-bold text-primary">{selectedCourse.completedCount} / {selectedCourse.taskCount} Tasks</p>
              </div>

              <div className="space-y-3">
                {tasks
                  .filter(t => t.course_id === selectedCourse.course_id)
                  .map(task => (
                    <div 
                      key={task.id}
                      onClick={() => toggleTask(task.id, task.is_completed)}
                      className={`group flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                        task.is_completed 
                          ? 'bg-emerald-500/5 border-emerald-500/20 shadow-inner' 
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`transition-transform duration-200 group-active:scale-90 ${task.is_completed ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {task.is_completed ? <CheckSquare className="h-6 w-6" /> : <Square className="h-6 w-6" />}
                      </div>
                      <span className={`text-sm font-semibold transition-all ${
                        task.is_completed ? 'text-slate-500 line-through decoration-emerald-500/50' : 'text-slate-200'
                      }`}>
                        {task.task_name}
                      </span>
                    </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Final Grade Weight</span>
                <span className="text-xs font-bold text-white">85% Required to Pass</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-700" 
                  style={{ width: `${selectedCourse.progress}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}