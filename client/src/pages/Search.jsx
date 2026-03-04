import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Search as SearchIcon, BookOpen, Users, Calendar, Clock } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    if (!query || !user) return;

    const performSearch = async () => {
      setLoading(true);
      try {
        // Search courses
        const [coursesRes, eventsRes] = await Promise.all([
          supabase
            .from('enrollments')
            .select('*, courses(*)')
            .eq('user_id', user.id)
            .textSearch('courses.course_name', query),
          supabase
            .from('events')
            .select('*')
            .textSearch('title', query),
        ]);

        const courseResults = (coursesRes.data || []).map((e) => ({
          id: e.courses.id,
          type: 'course',
          title: e.courses.course_name,
          subtitle: e.courses.course_code,
          description: `Instructor: ${e.courses.instructor || 'TBA'}`,
          icon: BookOpen,
        }));

        const eventResults = (eventsRes.data || []).map((e) => ({
          id: e.id,
          type: 'event',
          title: e.title,
          subtitle: new Date(e.start_date).toLocaleDateString(),
          description: e.description,
          icon: Calendar,
        }));

        setResults([...courseResults, ...eventResults]);
      } catch (error) {
        console.error('Search error:', error);
      }
      setLoading(false);
    };

    performSearch();
  }, [query, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(localQuery)}`);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'course') {
      navigate('/app/courses');
    } else if (result.type === 'event') {
      navigate('/app/events');
    }
  };

  return (
    <Layout title="Search">
      <div className="space-y-6 max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              style={{ width: 18, height: 18 }}
            />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search courses, events, materials..."
              className="w-full px-4 py-3 pl-10 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </form>

        {query && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : results.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching for different keywords or browse by category.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-foreground">
                  Results for "{query}" ({results.length})
                </h2>
                <div className="space-y-3">
                  {results.map((result) => {
                    const Icon = result.icon;
                    return (
                      <div
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {result.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{result.subtitle}</p>
                            {result.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {result.description}
                              </p>
                            )}
                          </div>
                          <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full flex-shrink-0">
                            {result.type}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {!query && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Search across your campus</h3>
            <p className="text-muted-foreground">
              Find courses, events, materials and more using the search bar above.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
