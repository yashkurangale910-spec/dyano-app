import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LayoutShell from './components/ui/LayoutShell';
import './index.css';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const QuizLab = lazy(() => import('./pages/QuizLab'));
const FlashcardSpace = lazy(() => import('./pages/FlashcardSpace'));
const PDFLab = lazy(() => import('./pages/PDFLab'));
const ProgressJourney = lazy(() => import('./pages/ProgressJourney'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="text-4xl mb-4 text-cosmic-cyan">🌌</div>
        <div className="text-xs uppercase tracking-[0.4em] font-display text-white/40">Synchronizing...</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route element={<LayoutShell />}>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz" element={<QuizLab />} />
                <Route path="/flashcards" element={<FlashcardSpace />} />
                <Route path="/pdf" element={<PDFLab />} />
                <Route path="/progress" element={<ProgressJourney />} />
                <Route path="/roadmap" element={<Roadmap />} />
              </Route>
            </Routes>
          </Suspense>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
