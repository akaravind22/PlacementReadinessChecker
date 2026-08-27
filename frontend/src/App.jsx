import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificationsPage from './pages/CertificationsPage';
import InternshipsPage from './pages/InternshipsPage';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';
import QuizResultPage from './pages/QuizResultPage';
import StudentDrivesPage from './pages/StudentDrivesPage';
import ResourcesPage from './pages/ResourcesPage';
import NotificationsPage from './pages/NotificationsPage';
import StudentReportPage from './pages/StudentReportPage';
import SettingsPage from './pages/SettingsPage';

// Officer Pages
import OfficerDashboard from './pages/OfficerDashboard';
import StudentManagementPage from './pages/StudentManagementPage';
import StudentDetailPage from './pages/StudentDetailPage';
import PostDrivePage from './pages/PostDrivePage';
import UploadResourcePage from './pages/UploadResourcePage';
import OfficerReportsPage from './pages/OfficerReportsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageQuizzesPage from './pages/ManageQuizzesPage';
import ManageDrivesPage from './pages/ManageDrivesPage';
import ManageResourcesPage from './pages/ManageResourcesPage';
import AdminReportsPage from './pages/AdminReportsPage';

// Layout Wrappers
const MainLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <div className="flex-grow-1">
      <Outlet />
    </div>
    <Footer />
  </div>
);

const DashboardLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <div className="container-fluid dashboard-wrapper flex-grow-1">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);

// The marketing landing page is only for visitors who are not signed in.
const HomeRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner message="Loading your workspace..." />;
  if (!user) return <Landing />;

  const dashboard = user.role === 'Admin'
    ? '/admin-dashboard'
    : user.role === 'Placement Officer'
      ? '/officer-dashboard'
      : '/student-dashboard';
  return <Navigate to={dashboard} replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<ProfilePage />} />
                <Route path="/student/skills" element={<SkillsPage />} />
                <Route path="/student/projects" element={<ProjectsPage />} />
                <Route path="/student/certifications" element={<CertificationsPage />} />
                <Route path="/student/internships" element={<InternshipsPage />} />
                <Route path="/student/quizzes" element={<QuizListPage />} />
                <Route path="/student/quiz/:id" element={<QuizPage />} />
                <Route path="/student/quiz-result" element={<QuizResultPage />} />
                <Route path="/student/drives" element={<StudentDrivesPage />} />
                <Route path="/student/resources" element={<ResourcesPage />} />
                <Route path="/student/report" element={<StudentReportPage />} />
                <Route path="/student/notifications" element={<NotificationsPage />} />
              </Route>
            </Route>

            {/* Placement Officer Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Placement Officer', 'Admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/officer-dashboard" element={<OfficerDashboard />} />
                <Route path="/officer/students" element={<StudentManagementPage />} />
                <Route path="/officer/students/:id" element={<StudentDetailPage />} />
                <Route path="/officer/post-drive" element={<PostDrivePage />} />
                <Route path="/officer/upload-resource" element={<UploadResourcePage />} />
                <Route path="/officer/quizzes" element={<ManageQuizzesPage />} />
                <Route path="/officer/reports" element={<OfficerReportsPage />} />
              </Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsersPage />} />
                <Route path="/admin/quizzes" element={<ManageQuizzesPage />} />
                <Route path="/admin/drives" element={<ManageDrivesPage />} />
                <Route path="/admin/resources" element={<ManageResourcesPage />} />
                <Route path="/admin/reports" element={<AdminReportsPage />} />
              </Route>
            </Route>

            {/* Fallback 404 Route */}
            <Route path="*" element={<MainLayout />}>
              <Route path="*" element={
                <div className="container py-5 text-center">
                  <h1 className="display-1 fw-bold">404</h1>
                  <p className="lead text-muted">Page Not Found</p>
                </div>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
