import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Plus, Trash2, Search, Filter, CheckCircle2, GraduationCap, ArrowRight } from 'lucide-react';

export default function Enrollment() {
  const { user } = useAuth();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses,  setEnrolledCourses]  = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedDept,     setSelectedDept]     = useState('all');

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          supabase.from('courses').select('*').eq('status', 'active'),
          supabase.from('enrollments').select('*, courses(*)').eq('user_id', user.id).eq('status', 'active'),
        ]);
        const enrolledData = enrollmentsRes.data?.map(e => e.courses) || [];
        const enrolledIds  = new Set(enrolledData.map(c => c.id));
        setEnrolledCourses(enrolledData);
        setAvailableCourses(coursesRes.data?.filter(c => !enrolledIds.has(c.id)) || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleEnroll = async (courseId) => {
    try {
      const course = availableCourses.find(c => c.id === courseId);
      if (!course) return;
      const { error } = await supabase.from('enrollments').insert([{ user_id: user.id, course_id: courseId, status: 'active' }]);
      if (error) throw error;
      await supabase.from('payments').insert([{ user_id: user.id, course_id: courseId, description: `Tuition Fee: ${course.course_name}`, amount: 3000, status: 'pending', semester: 'First Semester 2026' }]);
      setEnrolledCourses(prev => [...prev, course]);
      setAvailableCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (error) {
      alert(`Failed to enroll: ${error.message}`);
    }
  };

  const handleDrop = async (courseId) => {
    if (!confirm('Drop this course?')) return;
    try {
      const { error } = await supabase.from('enrollments').delete().eq('user_id', user.id).eq('course_id', courseId);
      if (error) throw error;
      const course = enrolledCourses.find(c => c.id === courseId);
      setAvailableCourses(prev => [...prev, course]);
      setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
    } catch { alert('Failed to drop course'); }
  };

  const departments    = [...new Set(availableCourses.map(c => c.department))];
  const filteredCourses = availableCourses.filter(c => {
    const matchSearch = c.course_name.toLowerCase().includes(searchTerm.toLowerCase()) || c.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept   = selectedDept === 'all' || c.department === selectedDept;
    return matchSearch && matchDept;
  });
  const totalCredits = enrolledCourses.reduce((s, c) => s + (c.credits || 0), 0);

  if (loading) return (
    <Layout title="Enrollment">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 18, height: 18, border: '2px solid #ddd8d0', borderTopColor: '#1a1510', animation: 'spin 0.75s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#b0aba5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Loading catalog…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout title="Enrollment">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .course-card { transition: box-shadow 0.2s, border-color 0.2s; }
        .course-card:hover { box-shadow: 0 6px 24px rgba(26,21,16,0.08); border-color: #1955e6 !important; }
        .enroll-btn:hover { background: #1a1510 !important; color: #F7F3EE !important; border-color: #1a1510 !important; }
        .drop-btn:hover { background: #fff4f4 !important; color: #c83030 !important; border-color: #f8c8c8 !important; }
        .search-input { outline: none; }
        .search-input:focus { border-color: #1955e6 !important; }
        .dept-select { outline: none; appearance: none; cursor: pointer; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header banner */}
        <div style={{ background: '#1a1510', padding: '2rem 2.25rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 500, color: '#5a5550', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              First Semester 2026
            </p>
            <h2 className="f-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              Course Enrollment
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#5a5550', marginTop: '0.5rem' }}>
              Build your ideal academic schedule.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', textAlign: 'center' }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#5a5550', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Credits</p>
            <span className="f-display" style={{ fontSize: '2rem', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.02em' }}>{totalCredits}</span>
          </div>
          <GraduationCap size={120} color="rgba(255,255,255,0.03)" style={{ position: 'absolute', right: -16, bottom: -24 }} />
        </div>

        {/* Enrolled schedule */}
        {enrolledCourses.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
              <div style={{ width: 3, height: 16, background: '#1a7a4a' }} />
              <h3 className="f-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1510', margin: 0 }}>My Schedule</h3>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: '#8a857f', fontWeight: 500 }}>
                {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1px', background: '#ddd8d0' }}>
              {enrolledCourses.map(course => (
                <div key={course.id} style={{ background: '#f0faf4', border: '1px solid transparent', padding: '1rem 1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, background: '#fff', border: '1px solid #a8dfc0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={14} color="#1a7a4a" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8375rem', fontWeight: 600, color: '#1a1510', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {course.course_name}
                      </p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: '#8a857f', margin: '0.1rem 0 0' }}>
                        {course.course_code} · {course.credits} units
                      </p>
                    </div>
                  </div>
                  <button className="drop-btn" onClick={() => handleDrop(course.id)} style={{
                    width: 30, height: 30, flexShrink: 0, background: 'transparent',
                    border: '1.5px solid #ddd8d0', color: '#c0bbb5', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & filter */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', background: '#fff', border: '1px solid #ddd8d0', padding: '0.875rem 1rem' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={13} color="#c0bbb5" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search by name or code…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              style={{
                width: '100%', height: 38,
                padding: '0 0.875rem 0 2.25rem',
                fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem',
                background: '#F7F3EE', border: '1.5px solid #ddd8d0', color: '#1a1510',
                transition: 'border-color 0.2s',
              }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Filter size={13} color="#c0bbb5" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="dept-select"
              style={{
                height: 38, padding: '0 2rem 0 2.25rem',
                fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem',
                background: '#F7F3EE', border: '1.5px solid #ddd8d0', color: '#1a1510',
                minWidth: 180,
              }}
            >
              <option value="all">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Course grid */}
        {filteredCourses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: '#ddd8d0' }}>
            {filteredCourses.map(course => (
              <div key={course.id} className="course-card" style={{ background: '#fff', border: '1px solid transparent', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                {/* Top */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
                  <div style={{ width: 36, height: 36, background: '#F7F3EE', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={16} color="#1955e6" />
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '0.2rem 0.5rem', background: '#F7F3EE', border: '1px solid #e8e2db', color: '#8a857f',
                  }}>{course.credits} units</span>
                </div>

                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#1955e6', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  {course.course_code}
                </p>
                <h3 className="f-display" style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1a1510', lineHeight: 1.25, marginBottom: '0.625rem', flex: 1 }}>
                  {course.course_name}
                </h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', color: '#8a857f', lineHeight: 1.6, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description || 'Comprehensive curriculum covering foundational principles and advanced industry practices.'}
                </p>

                {/* Footer */}
                <div style={{ borderTop: '1px solid #e8e2db', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#a0a09c' }}>
                    {course.enrolled_count}/{course.max_students} enrolled
                  </span>
                  <button className="enroll-btn" onClick={() => handleEnroll(course.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    background: 'transparent', border: '1.5px solid #1a1510',
                    fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', fontWeight: 700,
                    color: '#1a1510', letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '0.5rem 1rem', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                    Enroll <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #e8e2db', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, background: '#F7F3EE', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Search size={20} color="#c0bbb5" />
            </div>
            <h3 className="f-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1510', marginBottom: '0.5rem' }}>No courses found</h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#a0a09c' }}>
              Try adjusting your search or department filter.
            </p>
          </div>
        )}

      </div>
    </Layout>
  );
}