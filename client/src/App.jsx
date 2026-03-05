import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Enrollment from "./pages/Enrollment";
import Payments from "./pages/Payments";
import Advising from "./pages/Advising";
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import Activities from "./pages/Activities";
import Grades from "./pages/Grades";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import SkillArena from "./pages/SkillArena";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/app/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/app/enrollment" element={<ProtectedRoute><Enrollment /></ProtectedRoute>} />
          <Route path="/app/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/app/advising" element={<ProtectedRoute><Advising /></ProtectedRoute>} />
          <Route path="/app/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/app/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
          <Route path="/app/grades" element={<ProtectedRoute><Grades /></ProtectedRoute>} />
          <Route path="/app/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/app/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/app/clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
          <Route path="/app/skill-arena" element={<ProtectedRoute><SkillArena /></ProtectedRoute>} />
          <Route path="/app/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/app/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
        <ChatBot floating={true} />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
  
);

export default App;
