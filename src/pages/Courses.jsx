import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen, User, TrendingUp, ChartBar as BarChart3,
  CircleCheck as CheckCircle2, ChevronRight, Loader2, X,
  CheckSquare, Square, Lock, AlertCircle
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
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments').select('*, courses (*)').eq('user_id', user?.id).eq('status', 'active');
      if (enrollError) throw enrollError;

      const { data: payments } = await supabase
        .from('payments').select('course_id, status').eq('user_id', user?.id).eq('status', 'paid');
      const paidCourseIds = new Set(payments?.map(p => p.course_id));

      const { data: allTasks } = await supabase
        .from('course_tasks').select('*').eq('user_id', user?.id);

      const processedCourses = (enrollments || [])
        .filter(enr => paidCourseIds.has(enr.course_id))
        .map(enr => {
          const courseTasks = allTasks?.filter(t => t.course_id === enr.course_id) || [];
          const completed = courseTasks.filter(t => t.is_completed).length;
          const total = courseTasks.length;
          return { ...enr, progress: total > 0 ? Math.round((completed / total) * 100) : 0, taskCount: total, completedCount: completed };
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
    const channel = supabase.channel('academic_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, fetchCoursesAndProgress)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'course_tasks' }, fetchCoursesAndProgress)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, fetchCoursesAndProgress)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user, fetchCoursesAndProgress]);

  const toggleTask = async (taskId, currentStatus) => {
    const { error } = await supabase.from('course_tasks').update({ is_completed: !currentStatus }).eq('id', taskId);
    if (error) console.error('Update failed:', error);
  };

  if (loading) return (
    <Layout title="My Courses">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#b0aba5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Loading courses</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout title="My Courses">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .course-card { transition: box-shadow 0.2s, border-color 0.2s; }
        .course-card:hover { box-shadow: 0 6px 24px rgba(26,21,16,0.08); border-color: #1955e6 !important; }
        .task-row { transition: background 0.15s; cursor: pointer; }
        .task-row:hover { background: #f0ebe4 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ width: 36, height: 2, background: '#1955e6', marginBottom: '0.875rem' }} />
            <h2 className="f-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1a1510', letterSpacing: '-0.02em', margin: 0 }}>
              My Classroom
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#8a857f', marginTop: '0.375rem' }}>
              {enrolledCourses.length} paid subject{enrolledCourses.length !== 1 ? 's' : ''} this semester
            </p>
          </div>
          <button onClick={() => navigate('/app/payments')} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'transparent', border: '1.5px solid #ddd8d0',
            fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 600,
            color: '#4a4540', letterSpacing: '0.05em', textTransform: 'uppercase',
            padding: '0.625rem 1.125rem', cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1510'; e.currentTarget.style.color = '#1a1510'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd8d0'; e.currentTarget.style.color = '#4a4540'; }}>
            <AlertCircle size={13} /> Payment Portal
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          /* Empty state */
          <div style={{
            background: '#fff', border: '1px solid #e8e2db',
            padding: '4rem 2rem', textAlign: 'center',
          }}>
            <div style={{
              width: 52, height: 52, background: '#F7F3EE', border: '1px solid #e8e2db',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <Lock size={22} color="#b0aba5" />
            </div>
            <h3 className="f-display" style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1a1510', marginBottom: '0.625rem' }}>
              Access Restricted
            </h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#8a857f', maxWidth: 360, margin: '0 auto 1.75rem', lineHeight: 1.65 }}>
              Your courses will appear here once the tuition payment for this semester is processed and confirmed.
            </p>
            <button onClick={() => navigate('/app/payments')} style={{
              background: '#1a1510', color: '#F7F3EE', border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.75rem 1.75rem',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#2e2820'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a1510'}>
              Verify Payment Status
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: '#ddd8d0' }}>
            {enrolledCourses.map(enr => (
              <div key={enr.id} className="course-card" style={{ background: '#fff', border: '1px solid transparent', padding: '1.5rem' }}>
                {/* Top */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ width: 36, height: 36, background: '#F7F3EE', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={16} color="#1955e6" />
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '0.2rem 0.5rem', background: '#f0faf4',
                    border: '1px solid #a8dfc0', color: '#1a7a4a',
                  }}>Paid</span>
                </div>

                <h3 className="f-display" style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1a1510', margin: '0 0 0.25rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {enr.courses?.course_name}
                </h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', color: '#a0a09c', fontVariantNumeric: 'tabular-nums', marginBottom: '1.25rem' }}>
                  {enr.courses?.course_code}
                </p>

                {/* Progress */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 600, color: '#8a857f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#1a1510' }}>{enr.progress}%</span>
                  </div>
                  <div style={{ height: 3, background: '#e8e2db', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${enr.progress}%`, background: '#1955e6', transition: 'width 0.8s ease' }} />
                  </div>
                </div>

                <button onClick={() => setSelectedCourse(enr)} style={{
                  width: '100%', height: 36,
                  background: 'transparent', border: '1.5px solid #ddd8d0',
                  fontFamily: "'DM Sans',sans-serif", fontSize: '0.78rem', fontWeight: 600,
                  color: '#4a4540', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                  transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1a1510'; e.currentTarget.style.borderColor = '#1a1510'; e.currentTarget.style.color = '#F7F3EE'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#ddd8d0'; e.currentTarget.style.color = '#4a4540'; }}>
                  View Details <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side panel */}
      {selectedCourse && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', justifyContent: 'flex-end',
          background: 'rgba(26,21,16,0.4)',
        }} onClick={() => setSelectedCourse(null)}>
          <div style={{
            width: '100%', maxWidth: 420, height: '100%',
            background: '#F7F3EE', borderLeft: '1px solid #ddd8d0',
            display: 'flex', flexDirection: 'column',
            animation: 'slideIn 0.25s ease',
          }} onClick={e => e.stopPropagation()}>

            {/* Panel header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #ddd8d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a7a4a' }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 600, color: '#8a857f', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Active Session</span>
              </div>
              <button onClick={() => setSelectedCourse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0a09c', display: 'flex' }}
                onMouseEnter={e => e.currentTarget.style.color = '#1a1510'}
                onMouseLeave={e => e.currentTarget.style.color = '#a0a09c'}>
                <X size={16} />
              </button>
            </div>

            {/* Panel body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              <h4 className="f-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1510', lineHeight: 1.15, marginBottom: '0.5rem' }}>
                {selectedCourse.courses?.course_name}
              </h4>
              <div style={{ display: 'flex', gap: '1rem', fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', color: '#8a857f', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={12} />{selectedCourse.courses?.instructor}</span>
                <span>·</span>
                <span>{selectedCourse.courses?.course_code}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 600, color: '#8a857f', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Course Syllabus
                </span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#1955e6', fontWeight: 600 }}>
                  {selectedCourse.completedCount} / {selectedCourse.taskCount} Tasks
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#ddd8d0' }}>
                {tasks.filter(t => t.course_id === selectedCourse.course_id).map(task => (
                  <div key={task.id} className="task-row" onClick={() => toggleTask(task.id, task.is_completed)} style={{
                    background: task.is_completed ? '#f0faf4' : '#fff',
                    padding: '0.875rem 1rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    borderLeft: task.is_completed ? '2px solid #1a7a4a' : '2px solid transparent',
                  }}>
                    {task.is_completed
                      ? <CheckSquare size={15} color="#1a7a4a" />
                      : <Square size={15} color="#b0aba5" />
                    }
                    <span style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: '0.8375rem',
                      fontWeight: task.is_completed ? 400 : 500,
                      color: task.is_completed ? '#8a857f' : '#1a1510',
                      textDecoration: task.is_completed ? 'line-through' : 'none',
                      flex: 1,
                    }}>{task.task_name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel footer */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #ddd8d0', flexShrink: 0, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 600, color: '#8a857f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Final Grade Weight
                </span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: '#4a4540' }}>85% Required</span>
              </div>
              <div style={{ height: 3, background: '#e8e2db', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${selectedCourse.progress}%`, background: '#1a7a4a', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}