import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Clock, MapPin, User, Calendar, TrendingUp, ChartBar as BarChart3, CircleCheck as CheckCircle2, ChevronRight } from 'lucide-react';

export default function Courses() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            *,
            courses (*)
          `)
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (error) throw error;
        setEnrolledCourses(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();

    const channel = supabase
      .channel('enrollment_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enrollments',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchCourses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Layout title="My Courses">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-4" />
              <div className="h-6 bg-muted rounded w-1/2 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Courses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">My Courses</h2>
            <p className="text-muted-foreground mt-1">
              You're enrolled in {enrolledCourses.length} courses this semester
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            View All Grades
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No courses enrolled</h3>
            <p className="text-muted-foreground mb-6">
              Start by enrolling in courses for this semester
            </p>
            <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enrollment) => {
              const course = enrollment.courses;
              const progress = Math.floor(Math.random() * 40) + 60;

              return (
                <div
                  key={enrollment.id}
                  onClick={() => setSelectedCourse(course)}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-white/20 rounded backdrop-blur-sm">
                        {course.credits} Credits
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">{course.course_name}</h3>
                    <p className="text-sm text-white/80">{course.course_code}</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{course.instructor || 'TBA'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{course.schedule || 'TBA'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{course.room || 'TBA'}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Course Progress</span>
                        <span className="text-xs font-semibold text-foreground">{progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white">
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{enrolledCourses.length}</p>
                <p className="text-sm text-muted-foreground">Active Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {enrolledCourses.reduce((sum, e) => sum + (e.courses?.credits || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Credits</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3.74</p>
                <p className="text-sm text-muted-foreground">Current GPA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
