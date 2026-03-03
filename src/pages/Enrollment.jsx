import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users, Plus, Trash2, Search, Filter } from 'lucide-react';

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
            .select('course_id')
            .eq('user_id', user.id)
            .eq('status', 'active'),
        ]);

        const enrolledIds = new Set(enrollmentsRes.data?.map((e) => e.course_id) || []);
        const available = coursesRes.data?.filter((c) => !enrolledIds.has(c.id)) || [];

        setAvailableCourses(available);
        setEnrolledCourses(Array.from(enrolledIds));
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
      const { error } = await supabase
        .from('enrollments')
        .insert([{ user_id: user.id, course_id: courseId, status: 'active' }]);

      if (error) throw error;

      setEnrolledCourses([...enrolledCourses, courseId]);
      setAvailableCourses(availableCourses.filter((c) => c.id !== courseId));
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll in course');
    }
  };

  const handleDrop = async (courseId) => {
    if (!confirm('Are you sure you want to drop this course?')) return;

    try {
      const { error} = await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;

      const droppedCourse = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (droppedCourse.data) {
        setAvailableCourses([...availableCourses, droppedCourse.data]);
      }
      setEnrolledCourses(enrolledCourses.filter((id) => id !== courseId));
    } catch (error) {
      console.error('Error dropping:', error);
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
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-card border border-border rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Enrollment">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Course Enrollment</h2>
          <p className="text-muted-foreground mt-1">Add or drop courses for the current semester</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {course.course_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{course.course_code}</p>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                  {course.credits} Credits
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {course.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {course.enrolled_count}/{course.max_students}
                  </span>
                </div>
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Enroll</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
