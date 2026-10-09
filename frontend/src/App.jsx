import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ReviewPage from './pages/ReviewPage';
import ReportsPage from './pages/ReportsPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { MigrationProvider } from './contexts/MigrationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <MigrationProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
                  <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </MigrationProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
